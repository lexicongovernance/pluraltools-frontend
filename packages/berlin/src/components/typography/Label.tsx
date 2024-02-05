import styled, { css } from 'styled-components';

const StyledLabel = styled.label<{ $required?: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.375rem;

  ${(props) =>
    props.$required &&
    css`
      &:after {
        content: ' *';
        color: var(--color-error);
      }
    `}
`;

type LabelProps = {
  children: React.ReactNode;
  $required?: boolean;
} & React.ComponentProps<typeof StyledLabel>;

function Label({ children, $required = false, ...props }: LabelProps) {
  return (
    <StyledLabel {...props} $required={$required} title={$required ? 'Required' : ''}>
      {children}
    </StyledLabel>
  );
}

export default Label;
