import styled, { css } from 'styled-components'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
}

const StyledLabel = styled.label<LabelProps>`
  font-weight: 500;
  font-size: 0.9rem;

  ${(props) =>
    props.required &&
    css`
      &:after {
        content: ' *';
        color: #db4545;
      }
    `}
`

function Label({ children, required }: LabelProps) {
  return (
    <StyledLabel required={required} title={required ? 'Required' : ''}>
      {children}
    </StyledLabel>
  )
}

export default Label
