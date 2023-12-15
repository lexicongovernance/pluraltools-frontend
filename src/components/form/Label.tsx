import styled, { css } from 'styled-components'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  isRequired?: boolean
}

const StyledLabel = styled.label<LabelProps>`
  font-weight: 500;
  font-size: 0.9rem;

  ${(props) =>
    props.isRequired &&
    css`
      &:after {
        content: ' *';
        color: #db4545;
      }
    `}
`

function Label({ children, isRequired }: LabelProps) {
  return (
    <StyledLabel isRequired={isRequired} title={isRequired ? 'Required' : ''}>
      {children}
    </StyledLabel>
  )
}

export default Label
