import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Main = styled.main`
  flex: 1;
  margin-inline: auto;
  padding-block: 4rem;
  width: min(90%, 1080px);
`;

export const SafeArea = styled.div`
  margin-inline: auto;
  width: min(100%, 720px);
`;
