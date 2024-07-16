import React, { forwardRef } from 'react';
import { StyledIcon } from './Icon.styled';

type IconProps = {
  children: React.ReactNode;
};

const Icon = forwardRef<HTMLDivElement, IconProps>(({ children }, ref) => (
  <StyledIcon ref={ref}>{children}</StyledIcon>
));

export default Icon;
