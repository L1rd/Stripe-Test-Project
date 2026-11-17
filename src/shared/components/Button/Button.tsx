import styled from "styled-components";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
}

const StyledButton = styled.button<{ $fullWidth: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-height: 52px;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  border: none;
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  font-size: 16px;
  font-weight: 600;

  transition: background 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.45;
  }
`;

export function Button({
    children,
    fullWidth = false,
    ...props
}: ButtonProps) {
    return (
        <StyledButton $fullWidth={fullWidth} {...props}>
            {children}
        </StyledButton>
    );
}