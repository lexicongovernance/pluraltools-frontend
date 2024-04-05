import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColum.styled';
import { Body } from '../typography/Body.styled';

export const Card = styled(FlexColumn)`
  border-radius: 1rem;
  border: 1px solid var(--color-black);
  overflow: hidden;
  padding: 2rem;
  width: 100%;
  gap: 0.5rem;
`;

export const Username = styled(Body)`
  font-weight: 600;
`;

export const FormattedDate = styled(Body)`
  color: #878787;
  font-size: 14px;
`;
