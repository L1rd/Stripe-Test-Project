import styled from "styled-components";

export const PaymentFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin-top: 24px;
`;

export const PaymentElementContainer = styled.div`
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
`;

export const PaymentButton = styled.button`
  width: 100%;
  min-height: 48px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PaymentMessage = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
`;

export const PaymentError = styled.p`
  margin: 0;
  color: #dc2626;
  font-size: 14px;
  line-height: 1.5;
`;
