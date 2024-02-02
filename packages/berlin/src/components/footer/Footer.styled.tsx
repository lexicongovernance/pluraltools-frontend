import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColum.styled';

export const SyledFooter = styled.footer`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 7.5rem;
  padding-block: 2rem;
`;

export const FooterContainer = styled(FlexColumn)`
  background-color: var(--color-white);
  width: min(85%, 1080px);
  text-align: center;
`;

export const Copy = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
`;
