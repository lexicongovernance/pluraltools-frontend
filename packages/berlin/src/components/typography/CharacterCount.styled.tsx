import styled from 'styled-components';

const CharacterCount = styled.p`
  color: #999999;
  font-size: 16px;
`;

export default function CharacterCounter({ count, limit }: { count: number; limit: number }) {
  return (
    <CharacterCount>
      {count}/{limit} characters
    </CharacterCount>
  );
}
