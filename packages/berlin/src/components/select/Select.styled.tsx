import React from 'react';
import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColum.styled';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input<{ $theme?: 'light' | 'dark' }>`
  appearance: none;
  background-color: var(--color-white);
  background-image: ${(props) => props.$theme && `url(/icons/arrow-down-${props.$theme}.svg)`};
  background-position: right 0.75rem top 50%;
  background-repeat: no-repeat;
  background-size: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-black);
  color: var(--color-black);
  cursor: default;
  padding: 0.75rem 1rem;
  width: 100%;

  &::placeholder {
    color: var(--color-black);
  }

  &:disabled {
    background-color: #3b3b3b4d;
    border: 1px solid #ccc;
    cursor: not-allowed;
  }
`;

export const ForwardedSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { $theme?: 'light' | 'dark' }
>((props, ref) => {
  return <SearchInput ref={ref} {...props} />;
});

export const Dropdown = styled.div`
  background-color: var(--color-white);
  border-radius: 0.25rem;
  border: 1px solid var(--color-black);
  color: var(--color-black);
  margin-top: 0.2rem;
  overflow: hidden;
  position: absolute;
  width: 100%;
  z-index: 2;
`;

export const Option = styled.option`
  padding: 0.5rem 1rem;

  &:hover {
    background-color: var(--color-gray);
    cursor: pointer;
  }
`;

export const LabelContainer = styled(FlexColumn)`
  margin-bottom: 0.5rem;
`;

export const ErrorsContainer = styled(FlexColumn)`
  margin-top: 0.5rem;
`;
