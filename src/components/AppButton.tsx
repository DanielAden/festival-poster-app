import React from 'react';
import { Button as RSButton, ButtonProps } from 'reactstrap';

interface Props extends ButtonProps {}

const AppButton: React.FC<Props> = ({ children, ...props }) => {
  const color = props.color ? props.color : 'primary';
  const size = props.size ? props.size : 'sm';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onClick?.(e);
  };

  return (
    <RSButton color={color} size={size} onClick={handleClick} {...props}>
      {children}
    </RSButton>
  );
};

export default AppButton;
