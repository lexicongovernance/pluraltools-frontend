import styled, { css } from 'styled-components';
import { Grid } from '../../containers/Grid.styled';
import { FlexColumn } from '../../containers/FlexColumn.styled';
import { FlexRow } from '../../containers/FlexRow.styled';

export const Column = styled(FlexColumn)`
  gap: 1rem;
  @media (min-width: 600px) {
    gap: 0;
  }
`;

export const Card = styled(Grid)<{ $expanded: boolean; $showFunding: boolean }>`
  border-radius: 0.5rem;
  border: 1px solid var(--color-black);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;

  @media (min-width: 600px) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid var(--color-black);
    cursor: pointer;
    display: grid;
    grid-template-columns: ${(props) =>
      props.$showFunding ? 'auto repeat(3, 48px) 100px' : 'auto repeat(3, 48px)'};
    overflow: hidden;
    padding: 0rem;
    padding: 1.5rem;
    position: relative;
    transition: height 0.3s ease-in-out;
    width: 100%;
  }

  .description {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
    grid-column: ${(props) => (props.$showFunding ? '1/6' : '1/5')};
  }
`;

export const TitleContainer = styled(FlexRow)`
  :first-child {
    display: none;
  }
  @media (min-width: 600px) {
    :first-child {
      display: inline;
    }
  }
`;

export const Icon = styled.div`
  display: inline;

  @media (min-width: 600px) {
    display: none;
  }
`;

export const Plurality = styled(FlexRow)<{ $showFunding: boolean }>`
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-black);

  :last-child {
    margin-left: auto;
  }

  @media (min-width: 600px) {
    border: none;
    padding: 0;
    :last-child {
      display: none;
    }
  }

  ${(props) =>
    props.$showFunding &&
    css`
      border: none;
      :nth-child(3) {
        display: none;
      }
    `}
`;

export const Funding = styled(FlexRow)<{ $expanded: boolean; $showFunding: boolean }>`
  display: ${(props) => (props.$showFunding ? 'flex' : 'none')};
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-black);

  :last-child {
    margin-left: auto;
  }

  @media (min-width: 600px) {
    border: none;
    padding: 0;
    :last-child {
      display: none;
    }
  }
`;
