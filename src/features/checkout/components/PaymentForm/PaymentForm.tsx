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

interface PaymentFormProps {
    paymentId: string;
}

export const PaymentForm = ({ paymentId }: PaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const dispatch = useAppDispatch();
    const { navigateToStep } = useFlowNavigation();

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
                        "Your payment is being processed. Please wait.",
                    );
                    return;

                case "requires_payment_method":
                    setErrorMessage(
                        "The payment was not completed. Please try another payment method.",
                    );
                    return;

                case "requires_action":
                    setStatusMessage(
                        "Additional payment verification is required.",
                    );
                    return;

                case "canceled":
                    setErrorMessage("This payment was canceled.");
                    return;

                default:
                    setStatusMessage(
                        "The payment status is being verified. Please try again shortly.",
                    );
            }
        } catch {
            setErrorMessage(
                "Unable to verify the payment status. Please try again.",
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
                {isSubmitting ? "Processing payment..." : "Pay now"}
            </PaymentButton>
        </PaymentFormContainer>
    );
};