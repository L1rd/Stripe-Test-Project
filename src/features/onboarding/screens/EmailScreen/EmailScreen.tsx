import { useState } from "react";

import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import { selectEmail } from "../../onboardingSelectors";
import { setEmail } from "../../onboardingSlice";

import { useFlowNavigation } from "../../hooks/useFlowNavigation";

import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { Button } from "@/shared/components/Button/Button";
import { Input } from "@/shared/components/Input/Input";

import { Form } from "@/shared/components/ScreenLayout/ScreenLayout.styles";
import { useTranslation } from "react-i18next";

export function EmailScreen() {
    const dispatch = useAppDispatch();
    const { t: onboarding } = useTranslation('onboarding');
    const { t: general } = useTranslation();

    const emailSchema = z
        .string()
        .trim()
        .email(onboarding('email.invalid'));

    const email = useAppSelector(selectEmail);

    const [hasEdited, setHasEdited] = useState(false);

    const { goToNextStep } = useFlowNavigation();

    const validation = emailSchema.safeParse(email);

    const error =
        hasEdited && !validation.success
            ? validation.error.issues[0]?.message
            : undefined;

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!validation.success) {
            setHasEdited(true);
            return;
        }

        dispatch(setEmail(validation.data));

        goToNextStep();
    };

    return (
        <ScreenLayout
            title={onboarding('email.title')}
            description={onboarding('email.description')}
        >
            <Form onSubmit={handleSubmit}>
                <div>
                    <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(event) => {
                            setHasEdited(true);
                            dispatch(setEmail(event.target.value));
                        }}
                        error={error}
                    />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={!validation.success}
                >
                    {general('common.continue')}
                </Button>
            </Form>
        </ScreenLayout>
    );
}