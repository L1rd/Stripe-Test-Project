import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
  color: #1f2937;
`;

export const Header = styled.div`
  margin: 32px 0;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0 0 12px;

  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
`;

export const Description = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 16px;
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

export const PlanCard = styled.div<{ $selected: boolean }>`
  position: relative;
  padding: 28px 24px;
  border: 2px solid ${({ $selected }) => ($selected ? "#635BFF" : "#E5E7EB")};
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 0 3px rgba(99, 91, 255, 0.1)" : "none"};

  &:hover {
    border-color: #635bff;
  }
`;

export const PopularBadge = styled.span`
  display: inline-block;
  margin-bottom: 16px;
  padding: 5px 10px;
  border-radius: 20px;
  background: #eeedff;
  color: #635bff;
  font-size: 12px;
  font-weight: 600;
`;

export const PlanName = styled.h2`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
`;

export const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

export const PlanPeriod = styled.p`
  margin: 8px 0 24px;
  color: #6b7280;
  font-size: 14px;
`;

export const SelectIndicator = styled.div<{ $selected: boolean }>`
  margin-top: 24px;
  padding: 12px;
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? "#635BFF" : "#F3F4F6")};
  color: ${({ $selected }) => ($selected ? "#ffffff" : "#374151")};
  text-align: center;
  font-weight: 600;
`;

export const StatusMessage = styled.p`
  margin: 24px 0;
  color: #6b7280;
  text-align: center;
`;

export const ErrorContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: #fef2f2;
  text-align: center;
`;

export const ErrorText = styled.p`
  margin: 0 0 12px;
  color: #dc2626;
`;

export const RetryButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #635bff;
  color: white;
  cursor: pointer;
  font-weight: 600;
`;
