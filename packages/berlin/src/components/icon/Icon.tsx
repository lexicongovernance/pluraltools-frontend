import React, { forwardRef } from 'react';
import { StyledIcon } from './Icon.styled';

type IconProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

const Icon = forwardRef<HTMLDivElement, IconProps>(({ children, onClick }, ref) => (
  <StyledIcon ref={ref} onClick={onClick}>
    {children}
  </StyledIcon>
));

export default Icon;
