import styled from 'styled-components';

const CharacterCount = styled.p`
  color: #999999;
  font-size: 0.875rem;
  line-height: 1rem;
`;

type CharacterCounterProps = { 
  count: number; 
  limit: number 
}

function CharacterCounter({ count, limit }: CharacterCounterProps) {
  return (
    <CharacterCount>
      {count}/{limit} characters
    </CharacterCount>
  );
}

export default CharacterCounter