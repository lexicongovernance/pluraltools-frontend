import styled from 'styled-components';

export const SecretCodeContainer = styled.div`
  border-radius: 0.25rem;
  border: 1px solid var(--color-black);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.5rem;
  width: 100%;

  @media (min-width: 600px) {
    width: auto;
  }
`;
