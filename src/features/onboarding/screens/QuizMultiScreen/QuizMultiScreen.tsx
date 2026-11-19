
import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { ChoiceGroup } from "@/shared/components/ChoiceGroup/ChoiceGroup";
import { Button } from "@/shared/components/Button/Button";

import { MULTI_QUESTION } from "../quizQuestions";
import { useFlowNavigation } from "../../hooks/useFlowNavigation";
import { setQuizAnswer } from "../../onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useTranslation } from "react-i18next";

export function QuizMultiScreen() {
    const dispatch = useAppDispatch();
    const { t: general } = useTranslation();
    const { t: onboarding } = useTranslation('onboarding');
    
    const savedAnswer = useAppSelector(
        (state) => state.onboarding.quizAnswers[MULTI_QUESTION.id]
    );

    const selectedAnswers = Array.isArray(savedAnswer)
        ? savedAnswer
        : [];

    const { goToNextStep } = useFlowNavigation();

    const handleChange = (values: string[]) => {
        dispatch(
            setQuizAnswer({
                questionId: MULTI_QUESTION.id,
                answer: values,
            })
        );
    };

    const handleContinue = () => {
        if (selectedAnswers.length === 0) return;

        goToNextStep();
    };

    return (
        <ScreenLayout
            title={onboarding('quizMulti.title')}
            description={onboarding('quizMulti.description')}
        >
            <ChoiceGroup
                mode="multiple"
                options={MULTI_QUESTION.options}
                value={selectedAnswers}
                onChange={handleChange}
            />

            <Button
                fullWidth
                type="button"
                disabled={selectedAnswers.length === 0}
                onClick={handleContinue}
                style={{ marginTop: '30px' }}
            >
                {general('common.continue')}
            </Button>
        </ScreenLayout>
    );
}
