import type { ChoiceOption } from "@/shared/components/ChoiceGroup/ChoiceGroup";

export const SINGLE_QUESTION = {
  id: "main_goal",
  title: "What is your main goal?",
  description: "Choose the option that best describes you.",
  options: [
    { value: "health", label: "Improve my health" },
    { value: "fitness", label: "Get in better shape" },
    { value: "energy", label: "Have more energy" },
    { value: "habits", label: "Build healthier habits" },
  ] satisfies ChoiceOption[],
};

export const MULTI_QUESTION = {
  id: "interests",
  title: "What would you like to improve?",
  description: "Select all options that apply.",
  options: [
    { value: "nutrition", label: "Nutrition" },
    { value: "sleep", label: "Sleep quality" },
    { value: "activity", label: "Physical activity" },
    { value: "stress", label: "Stress management" },
  ] satisfies ChoiceOption[],
};
