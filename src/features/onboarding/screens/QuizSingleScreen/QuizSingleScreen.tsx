
import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { ChoiceGroup } from "@/shared/components/ChoiceGroup/ChoiceGroup";
import { Button } from "@/shared/components/Button/Button";

import { SINGLE_QUESTION } from "../quizQuestions";
import { useFlowNavigation } from "../../hooks/useFlowNavigation";
import { setQuizAnswer } from "../../onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

export function QuizSingleScreen() {
    const dispatch = useAppDispatch();

    const savedAnswer = useAppSelector(
        (state) => state.onboarding.quizAnswers[SINGLE_QUESTION.id]
    );

    const selectedAnswer =
        typeof savedAnswer === "string" ? savedAnswer : "";

    const { goToNextStep } = useFlowNavigation();

    const handleChange = (value: string) => {
        dispatch(
            setQuizAnswer({
                questionId: SINGLE_QUESTION.id,
                answer: value,
            })
        );
    };

    const handleContinue = () => {
        if (!selectedAnswer) return;

        goToNextStep();
    };

    return (
        <ScreenLayout
            title={SINGLE_QUESTION.title}
            description={SINGLE_QUESTION.description}
        >
            <ChoiceGroup
                mode="single"
                options={SINGLE_QUESTION.options}
                value={selectedAnswer}
                onChange={handleChange}
            />

            <Button
                fullWidth
                type="button"
                disabled={!selectedAnswer}
                onClick={handleContinue}
                style={{ marginTop: '30px' }}
            >
                Continue
            </Button>
        </ScreenLayout>
    );
}
