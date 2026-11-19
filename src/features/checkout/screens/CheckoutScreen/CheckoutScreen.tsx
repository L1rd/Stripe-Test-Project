import { useEffect, useMemo, useRef, useState } from "react";

import {
  createPayment,
  fetchPaymentStatus,
  fetchPlans,
  fetchStripeConfig,
  setPaymentId,
  setSelectedPlan,
} from "@/features/checkout/checkoutSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/app/store/hooks";

import {
  selectEmail,
  selectPhone,
} from "@/features/onboarding/onboardingSelectors";

import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { Button } from "@/shared/components/Button/Button";

import {
  Form,
  ErrorText as FormErrorText,
} from "@/shared/components/ScreenLayout/ScreenLayout.styles";

import {
  Description,
  ErrorContainer,
  ErrorText,
  Header,
  PlanCard,
  PlanName,
  PlanPeriod,
  PlanPrice,
  PlansGrid,
  PopularBadge,
  RetryButton,
  SelectIndicator,
  StatusMessage,
  Title,
} from "./CheckoutScreen.style";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "../../components/PaymentForm/PaymentForm";
import { useFlowNavigation } from "@/features/onboarding/hooks/useFlowNavigation";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CheckoutScreen = () => {
  const dispatch = useAppDispatch();
  const isSubmittingRef = useRef(false);

  const email = useAppSelector(selectEmail);
  const phone = useAppSelector(selectPhone);

  const {
    plans,
    plansStatus,
    plansError,
    selectedPlanId,

    stripePublishableKey,
    configStatus,
    configError,

    paymentId,
    clientSecret,
    idempotencyKey,
    paymentStatus,
    paymentError,
    paymentStatusCheckStatus
  } = useAppSelector((state) => state.checkout);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const { navigateToStep } = useFlowNavigation();
  const { t } = useTranslation('checkout');
  const { t: general } = useTranslation('')

  const returnedPaymentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  const paymentIdToVerify = returnedPaymentId ?? paymentId;

  const hasReturnedFromStripe = Boolean(
    returnedPaymentId || redirectStatus,
  );

  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) {
      return null;
    }

    return loadStripe(stripePublishableKey);
  }, [stripePublishableKey]);

  const selectedPlan = plans.find(
    (plan) => plan.id === selectedPlanId,
  );

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isValidPhone =
    /^\+[1-9]\d{7,14}$/.test(phone);

  const hasValidContactDetails =
    isValidEmail && isValidPhone;

  const hasPayment = Boolean(paymentId && clientSecret);

  const isCreatingPayment = paymentStatus === "creating";

  const canCreatePayment =
    Boolean(selectedPlanId) &&
    hasValidContactDetails &&
    configStatus === "succeeded" &&
    !isCreatingPayment &&
    !hasPayment;

  const handleRetry = () => {
    if (plansStatus === "failed") {
      void dispatch(fetchPlans());
    }

    if (configStatus === "failed") {
      void dispatch(fetchStripeConfig());
    }
  };

  const handleSelectPlan = (planId: string) => {
    if (hasPayment) {
      return;
    }

    dispatch(setSelectedPlan(planId));
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleCreatePayment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setHasSubmitted(true);

    if (
      isSubmittingRef.current ||
      !selectedPlanId ||
      !hasValidContactDetails ||
      !canCreatePayment
    ) {
      return;
    }

    isSubmittingRef.current = true;

    const key = idempotencyKey ?? crypto.randomUUID();

    try {
      await dispatch(
        createPayment({
          planId: selectedPlanId,
          email: email.trim(),
          phone,
          idempotencyKey: key,
        }),
      ).unwrap();
    } catch {
      // The error is already stored in Redux.
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const isLoading =
    plansStatus === "loading" ||
    configStatus === "loading";

  const hasError =
    plansStatus === "failed" ||
    configStatus === "failed";

  useEffect(() => {
    if (paymentStatusCheckStatus !== "succeeded") {
      return;
    }

    if (paymentStatus === "succeeded") {
      navigateToStep("success");
    }
  }, [
    paymentStatus,
    paymentStatusCheckStatus,
    navigateToStep,
  ]);

  useEffect(() => {
    if (plansStatus === "idle") {
      void dispatch(fetchPlans());
    }

    if (configStatus === "idle") {
      void dispatch(fetchStripeConfig());
    }
  }, [dispatch, plansStatus, configStatus]);

  useEffect(() => {
    if (!hasReturnedFromStripe || !paymentIdToVerify) {
      return;
    }

    if (!paymentId) {
      dispatch(setPaymentId(paymentIdToVerify));
    }

    void dispatch(fetchPaymentStatus(paymentIdToVerify));
  }, [
    dispatch,
    hasReturnedFromStripe,
    paymentIdToVerify,
    paymentId,
  ]);

  return (
    <ScreenLayout
      title={t('title')}
      description={t('description')}
    >
      {isLoading && plans.length === 0 && (
        <StatusMessage>
          {t('loading')}
        </StatusMessage>
      )}

      {hasError && (
        <ErrorContainer>
          <ErrorText>
            {plansError || configError}
          </ErrorText>

          <RetryButton
            type="button"
            onClick={handleRetry}
          >
            {t('retry')}
          </RetryButton>
        </ErrorContainer>
      )}

      {plansStatus === "succeeded" && (
        <PlansGrid>
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <PlanCard
                key={plan.id}
                $selected={isSelected}
                onClick={() => handleSelectPlan(plan.id)}
                aria-disabled={hasPayment}
              >
                {plan.popular && (
                  <PopularBadge>
                    {t('popular')}
                  </PopularBadge>
                )}

                <PlanName>{plan.name}</PlanName>

                <PlanPrice>
                  {formatPrice(plan.amount, plan.currency)}
                </PlanPrice>

                {plan.period && (
                  <PlanPeriod>
                    {plan.period}
                  </PlanPeriod>
                )}

                <SelectIndicator $selected={isSelected}>
                  {isSelected ? t('plan.selected') : t('plan.select')}
                </SelectIndicator>
              </PlanCard>
            );
          })}
        </PlansGrid>
      )}

      {plansStatus === "succeeded" && plans.length === 0 && (
        <StatusMessage>
          {t('noPlans')}
        </StatusMessage>
      )}

      {configStatus === "succeeded" && (
        <>
          {!hasPayment && (
            <Form onSubmit={handleCreatePayment}>
              <Header>
                <Title>{t('contact.title')}</Title>

                <Description>
                  {t('contact.description')}
                </Description>
              </Header>

              <div>
                <Description>{t('contact.email')}</Description>
                <strong>{email || t('contact.notProvided')}</strong>
              </div>

              <div>
                <Description>{t('contact.phone')}</Description>
                <strong>{phone || t('contact.notProvided')}</strong>
              </div>

              {hasSubmitted && !isValidEmail && (
                <FormErrorText>
                  {t('validation.email')}
                </FormErrorText>
              )}

              {hasSubmitted && !isValidPhone && (
                <FormErrorText>
                  {t('validation.phone')}
                </FormErrorText>
              )}

              {hasSubmitted && !selectedPlanId && (
                <FormErrorText>
                  {t('validation.phone')}
                </FormErrorText>
              )}

              {paymentError && (
                <FormErrorText>{general(paymentError, { defaultValue: paymentError })}</FormErrorText>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={!canCreatePayment}
              >
                {isCreatingPayment
                  ? t('payment.creating')
                  : t('payment.continue')}
              </Button>
            </Form>
          )}

          {hasPayment && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{
                locale: "en",
                clientSecret: clientSecret!,
                appearance: {
                  theme: "stripe",
                },
              }}
            >
              <PaymentForm paymentId={paymentId!} />
            </Elements>
          )}
        </>
      )}

      {selectedPlan && (
        <StatusMessage>
          {t("plan.selectedLabel", {
            name: selectedPlan.name,
          })}
        </StatusMessage>
      )}
    </ScreenLayout>
  );
};