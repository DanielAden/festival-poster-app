import React from 'react';
import './Group.css';

export interface GroupProps {
  onNextPage: () => void;
  onPrevPage: () => void;
  onSubmit: () => void;
  currentPage: number;
}
export const Group: React.FC<GroupProps> = ({ children, currentPage }) => {
  return (
    <>
      {React.Children.map(children, (child, i) => {
        return (
          <div className={`${i !== currentPage && 'hidden'}`}>{child}</div>
        );
      })}
    </>
  );
};

// export interface PageProps {}
// export const Page: React.FC<PageProps> = () => {};
