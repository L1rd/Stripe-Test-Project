import styled from "styled-components";
import type { InputHTMLAttributes } from "react";
import { ErrorText } from "../ScreenLayout/ScreenLayout.styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  min-height: 52px;
  padding: 0 16px;

  border: 1px solid
    ${({ theme, $hasError }) =>
        $hasError ? theme.colors.error : theme.colors.border};

  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;


export function Input({ error, ...props }: InputProps) {
    return (
        <InputWrapper>
            <StyledInput
                {...props}
                $hasError={Boolean(error)}
                aria-invalid={Boolean(error)}
            />

            {error && <ErrorText role="alert">{error}</ErrorText>}
        </InputWrapper>
    );
}