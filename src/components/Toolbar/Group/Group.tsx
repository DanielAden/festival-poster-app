import React from 'react';
import './Group.css';

interface GroupSubmit {
  text: string;
  submitFN: () => void;
  color?: 'success' | 'primary' | 'secondary';
}
export interface GroupProps {
  pageHeaders: string[];
  onNextPage: () => void;
  onPrevPage: () => void;
  submit: GroupSubmit | GroupSubmit[];
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
