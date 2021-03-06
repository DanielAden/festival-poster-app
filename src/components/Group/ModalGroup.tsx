import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Group, GroupProps } from './Group';

export interface ModalGroupProps extends GroupProps {
  active: boolean;
  toggle: () => void;
}

export const ModalGroup: React.FC<ModalGroupProps> = ({
  children,
  active,
  toggle,
  ...groupProps
}) => {
  const { groupStatePkg, currentPage, submitOptions, pageHeaders } = groupProps;
  const lastPage = React.Children.count(children) - 1;
  const pageHeader = pageHeaders[currentPage];

  const renderSubmit = () => {
    const submits = Array.isArray(submitOptions)
      ? submitOptions
      : [submitOptions];
    return submits.map(s => (
      <Button
        color={s.color || 'success'}
        onClick={() => {
          s.submitFN(groupStatePkg.state);
          toggle();
        }}
      >
        {s.text}
      </Button>
    ));
  };

  return (
    <div>
      <Modal scrollable size='lg' isOpen={active}>
        <ModalHeader toggle={toggle}>{pageHeader}</ModalHeader>
        <ModalBody>
          <Group {...groupProps}>{children}</Group>
        </ModalBody>
        <ModalFooter>
          {currentPage > 0 && (
            <Button color='secondary' onClick={groupProps.onPrevPage}>
              Previous
            </Button>
          )}
          {currentPage < lastPage && (
            <Button color='primary' onClick={groupProps.onNextPage}>
              Next
            </Button>
          )}
          {currentPage === lastPage && renderSubmit()}
          {
            <Button color='danger' onClick={() => toggle()}>
              Cancel
            </Button>
          }
        </ModalFooter>
      </Modal>
    </div>
  );
};
