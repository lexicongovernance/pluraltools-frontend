import styled from 'styled-components';

export const IconContainer = styled.div<{ $height: number; $width: number }>`
  height: ${(props) => (props.$height && `${props.$height}px`) || '24px'};
  width: ${(props) => (props.$width && `${props.$width}px`) || '24px'};
`;

export const Icon = styled.img<{ $flipVertical?: boolean }>`
  transform: rotate(${(props) => (props.$flipVertical ? '180deg' : '0deg')});
  transition: transform 0.3s ease-in-out;
`;
