import styled from 'styled-components';
import { FlexColumn } from '../../layout/Layout.styled';

export const StyledOnboarding = styled(FlexColumn)`
  align-items: center;
  margin-inline: auto;
  max-width: 450px;
  min-height: 380px;
  text-align: center;
`;

export const Dot = styled.div<{ active: boolean }>`
  background-color: ${(props) => (props.active ? 'var(--color-primary)' : 'gray')};
  border-radius: 50%;
  height: 0.5rem;
  transition: 0.2s ease-in;
  width: 0.5rem;
`;
