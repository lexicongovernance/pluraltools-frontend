import styled from 'styled-components';

const CharacterCount = styled.p`
  color: #999999;
  font-size: 0.875rem;
  line-height: 1rem;
`;

function CharacterCounter({ count, limit }: { count: number; limit: number }) {
  return (
    <CharacterCount>
      {count}/{limit} characters
    </CharacterCount>
  );
}

export default CharacterCounter