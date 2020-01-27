import React from 'react';

export interface GroupProps {
  onNextPage: () => void;
  onPrevPage: () => void;
  onSubmit: () => void;
  currentPage: number;
}
export const Group: React.FC<GroupProps> = ({ children, currentPage }) => {
  return <div>{React.Children.toArray(children)[currentPage]}</div>;
};
