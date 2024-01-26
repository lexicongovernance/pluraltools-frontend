import React from 'react';
import styled from 'styled-components';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const StyledSelect = styled.select`
  appearance: none;
  background-color: #3b3b3b;
  background-image: url('/arrow_down.svg');
  background-position: right 0.75rem top 50%;
  background-repeat: no-repeat;
  background-size: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0.75rem 1rem;
  width: 100%;

  &:disabled {
    background-color: #3b3b3b4d;
    border: 1px solid #ccc;
    cursor: not-allowed;
  }
`;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return <StyledSelect ref={ref} {...props} />;
});

export default Select;
