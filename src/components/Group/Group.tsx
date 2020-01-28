import React from 'react';
import './Group.css';

export interface GroupPageProps<T> {
  groupStatePkg: GroupStatePkg<T>;
}

export type GroupStatePkg<T> = Readonly<{
  state: T;
  mergeState: (newState: Partial<T>) => void;
}>;

export interface GroupSubmitOption<T> {
  text: string;
  submitFN: (state: T) => void;
  color?: 'success' | 'primary' | 'secondary';
}
export type GroupSubmitOptions<T> =
  | GroupSubmitOption<T>
  | GroupSubmitOption<T>[];
export interface GroupProps<T = any> {
  pageHeaders: string[];
  onNextPage: () => void;
  onPrevPage: () => void;
  submitOptions: GroupSubmitOptions<T>;
  currentPage: number;
  groupStatePkg: GroupStatePkg<T>;
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
