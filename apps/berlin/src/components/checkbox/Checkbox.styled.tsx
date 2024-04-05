import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  column-gap: 0.5rem;
`;

export const CheckboxContainer = styled.div`
  align-items: center;
  display: flex;
  height: 1.5rem;
  justify-content: center;
  width: 1.5rem;
`;

export const HiddenCheckbox = styled.input`
  border: 0;
  clip-path: inset(50%);
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;

  &:focus-within {
    outline: 2px solid red;
  }
`;

export const Icon = styled.svg`
  fill: none;
  stroke: var(--color-black);
  stroke-width: 3px;
`;

export const StyledCheckbox = styled.div<{ $checked: boolean }>`
  align-items: center;
  border-radius: 3px;
  border: 1.25px solid var(--color-black);
  cursor: pointer;
  display: flex;
  height: 1.125rem;
  justify-content: center;
  width: 1.125rem;

  ${Icon} {
    visibility: ${(props) => (props.$checked ? 'visible' : 'hidden')};
  }
`;
