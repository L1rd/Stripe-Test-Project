import { useState } from "react";

import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import { useAppDispatch } from "@/app/store/hooks";

import {
    fetchPaymentStatus,
    setPaymentError,
} from "@/features/checkout/checkoutSlice";
import { useFlowNavigation } from "@/features/onboarding/hooks/useFlowNavigation";


import {
    PaymentButton,
    PaymentElementContainer,
    PaymentError,
    PaymentFormContainer,
    PaymentMessage,
} from "./PaymentForm.styles";
import { useTranslation } from "react-i18next";

interface PaymentFormProps {
    paymentId: string;
}

export const PaymentForm = ({ paymentId }: PaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const dispatch = useAppDispatch();
    const { navigateToStep } = useFlowNavigation();
    const { t } = useTranslation('checkout');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!stripe || !elements || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setStatusMessage(null);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: "if_required",
            });

            if (error) {
                const message =
                    error.message ?? "Payment could not be completed.";

                setErrorMessage(message);
                dispatch(setPaymentError(message));
                return;
            }

            const payment = await dispatch(
                fetchPaymentStatus(paymentId),
            ).unwrap();

            switch (payment.status) {
                case "succeeded":
                    navigateToStep("success");
                    return;

                case "processing":
                    setStatusMessage(
                        t('status.processing'),
                    );
                    return;

                case "requires_payment_method":
                    setErrorMessage(
                        t('errors.failed'),
                    );
                    return;

                case "requires_action":
                    setStatusMessage(
                        t('status.requiresAction'),
                    );
                    return;

                case "canceled":
                    setErrorMessage(t('errors.canceled'));
                    return;

                default:
                    setStatusMessage(
                        t('status.verifying'),
                    );
            }
        } catch {
            setErrorMessage(
                t('errors.verify'),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PaymentFormContainer onSubmit={handleSubmit}>
            <PaymentElementContainer>
                <PaymentElement
                    options={{
                        layout: "tabs",
                    }}
                />
            </PaymentElementContainer>

            {errorMessage && (
                <PaymentError role="alert">
                    {errorMessage}
                </PaymentError>
            )}

            {statusMessage && (
                <PaymentMessage role="status">
                    {statusMessage}
                </PaymentMessage>
            )}

            <PaymentButton
                type="submit"
                disabled={!stripe || !elements || isSubmitting}
            >
                {isSubmitting ? t('payment.processing') : t('payment.payNow')}
            </PaymentButton>
        </PaymentFormContainer>
    );
};