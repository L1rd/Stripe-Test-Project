import styled from "styled-components";

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 48px 24px;
  text-align: center;
`;

export const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-size: 36px;
  font-weight: 700;
`;

export const SuccessTitle = styled.h1`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
`;

export const SuccessDescription = styled.p`
  margin: 0 0 32px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  line-height: 1.6;
`;
