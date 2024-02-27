import styled from 'styled-components';

export const Card = styled.article<{ $expanded: boolean }>`
  border-radius: 1rem;
  border: 1px solid var(--color-black);
  color: var(--color-white);
  cursor: pointer;
  overflow: hidden;
  padding: 2rem;
  position: relative;
  transition: height 0.3s ease-in-out;
  width: 100%;

  .statistics {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
  }
`;
export const Badge = styled.div<{ $type: 'gold' | 'silver' | 'bronze' }>`
  align-items: center;
  background-image: ${(props) => props.$type && `url('/icons/badge-${props.$type}.svg')`};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  height: 2rem;
  width: 2rem;
`;
