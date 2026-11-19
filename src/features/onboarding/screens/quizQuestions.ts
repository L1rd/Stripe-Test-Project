import type { ChoiceOption } from "@/shared/components/ChoiceGroup/ChoiceGroup";

export const SINGLE_QUESTION = {
    id: "main_goal",
    options: [
        { value: "health" },
        { value: "fitness" },
        { value: "energy" },
        { value: "habits" },
    ] satisfies ChoiceOption[],
};

export const MULTI_QUESTION = {
    id: "interests",
    options: [
        { value: "nutrition" },
        { value: "sleep" },
        { value: "activity" },
        { value: "stress" },
    ] satisfies ChoiceOption[],
};
