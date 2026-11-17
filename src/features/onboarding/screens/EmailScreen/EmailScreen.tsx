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

const emailSchema = z
    .string()
    .trim()
    .email("Введіть коректну email-адресу");

export function EmailScreen() {
    const dispatch = useAppDispatch();

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
            title="What's your email?"
            description="Enter your email address to continue."
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
                    Continue
                </Button>
            </Form>
        </ScreenLayout>
    );
}