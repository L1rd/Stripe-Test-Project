
import styled from "styled-components";

export interface ChoiceOption {
    value: string;
    label: string;
}

interface BaseProps {
    options: ChoiceOption[];
    disabled?: boolean;
}

type ChoiceGroupProps =
    | (BaseProps & {
        mode: "single";
        value: string;
        onChange: (value: string) => void;
    })
    | (BaseProps & {
        mode: "multiple";
        value: string[];
        onChange: (value: string[]) => void;
    });

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 56px;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  text-align: left;

  border: 1px solid
    ${({ $selected, theme }) =>
        $selected ? theme.colors.primary : theme.colors.border};

  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $selected, theme }) =>
        $selected ? `${theme.colors.primary}12` : theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export function ChoiceGroup(props: ChoiceGroupProps) {
    const isSelected = (optionValue: string): boolean => {
        if (props.mode === "single") {
            return props.value === optionValue;
        }

        return props.value.includes(optionValue);
    };

    const handleSelect = (optionValue: string) => {
        if (props.mode === "single") {
            props.onChange(optionValue);
            return;
        }

        const nextValue = props.value.includes(optionValue)
            ? props.value.filter((value) => value !== optionValue)
            : [...props.value, optionValue];

        props.onChange(nextValue);
    };

    return (
        <Group
            role={props.mode === "single" ? "radiogroup" : "group"}
            aria-label="Answer options"
        >
            {props.options.map((option) => {
                const selected = isSelected(option.value);

                return (
                    <OptionButton
                        key={option.value}
                        type="button"
                        $selected={selected}
                        disabled={props.disabled}
                        role={props.mode === "single" ? "radio" : "checkbox"}
                        aria-checked={selected}
                        onClick={() => handleSelect(option.value)}
                    >
                        {option.label}
                    </OptionButton>
                );
            })}
        </Group>
    );
}
