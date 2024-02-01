import React from 'react';
import styled from 'styled-components';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  appearance: none;
  background-color: #3b3b3b;
  background-image: url('/icons/arrow_down.svg');
  background-position: right 0.75rem top 50%;
  background-repeat: no-repeat;
  background-size: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  cursor: default;
  padding: 0.75rem 1rem;
  width: 100%;

  &::placeholder {
    color: var(--color-white);
  }

  &:disabled {
    background-color: #3b3b3b4d;
    border: 1px solid #ccc;
    cursor: not-allowed;
  }
`;

export const ForwardedSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <SearchInput ref={ref} {...props} />;
});

export const Dropdown = styled.div`
  position: absolute;
  background-color: #3b3b3b;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 0.2rem;
  /* border: 1px solid #ccc; */
  z-index: 2;
`;

export const Option = styled.option`
  padding: 0.5rem 1rem;

  &:hover {
    background-color: var(--color-primary);
    cursor: pointer;
  }
`;
