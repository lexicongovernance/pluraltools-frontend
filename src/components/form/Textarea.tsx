import styled from 'styled-components'

const StyledTextarea = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 200px;
  resize: none;
`

const Textarea = () => {
  return <StyledTextarea />
}

export default Textarea
