import styled from 'styled-components';

export const StyledEventCard = styled.article`
  background-color: var(--color-dark-gray);
  border-radius: 1rem;

  .content {
    padding: 2rem;
  }
`;

export const ImageContainer = styled.div`
  background-color: var(--color-skeleton-gray);
  border-radius: 1rem 1rem 0 0;
  height: 200px;
  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
    object-position: center;
    width: 100%;
  }
`;

export const Title = styled.h3`
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.25rem;
  line-height: 1.75rem;
  /* min-height: 3.5rem; */
`;

export const Description = styled.p`
  font-size: 1rem;
  line-height: 1.375rem;
  /* min-height: 1.375rem; */
`;
