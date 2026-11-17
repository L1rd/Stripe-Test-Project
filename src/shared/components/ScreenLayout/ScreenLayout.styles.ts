import styled from "styled-components";

export const Page = styled.main`
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const Card = styled.section`
  width: 100%;
  max-width: 480px;
  padding: 28px 22px;

  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};

  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.05);

  @media (min-width: 480px) {
    padding: 40px;
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.text};
  font-size: 26px;
  line-height: 1.3;
  font-weight: 700;
`;

export const ErrorText = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: 13px;
`;

export const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
  line-height: 1.6;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  overflow: hidden;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.border};
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};

  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};

  transition: width 0.3s ease;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;

  margin-bottom: ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;
