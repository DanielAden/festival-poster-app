import React, { useState } from 'react';
import { ListItem, createNewListItem, ListHandler, ListProps } from './List';
import {
  InputGroupAddon,
  Input,
  InputGroup,
  ListGroupItem,
  ButtonGroup,
} from 'reactstrap';
import AppButton from '../AppButton';
import '../../style.css';

export function handleActionClick(
  e: any,
  item: ListItem,
  handler: ListHandler,
) {
  e.preventDefault();
  handler(item);
}

interface Props extends ListProps {
  item: ListItem;
  isEditing: boolean;
  setIsEditing: React.Dispatch<any>;
  disableActions: boolean;
  rowNumber: number;
}
const ListRow: React.FC<Props> = ({
  rowNumber,
  disableActions,
  item,
  isEditing,
  setIsEditing,
  ...listProps
}) => {
  const [editText, setEditText] = useState(item.text);

  const {
    handleRemove,
    handleEdit,
    handleSelectionChange: handleSelect,
  } = listProps;
  const canEdit = listProps.canEditGlobal && item.canEdit && handleEdit;
  const canRemove = !!(listProps.canRemove && handleRemove);
  const canSelect = !!(listProps.canSelect && handleSelect !== undefined);
  const isSelected = !!item.isSelected;

  function renderIsEditing() {
    return (
      <ListGroupItem>
        <InputGroup>
          <Input
            value={editText}
            style={{
              display: 'inline',
            }}
            onChange={e => {
              setEditText(e.target.value);
            }}
          />

          <InputGroupAddon addonType='append'>
            <AppButton
              onClick={e => {
                handleActionClick(
                  e,
                  createNewListItem(item, { text: editText }),
                  handleEdit as ListHandler,
                );
                setEditText('');
                setIsEditing(false);
              }}
            >
              Save
            </AppButton>
          </InputGroupAddon>
          <InputGroupAddon addonType='append'>
            <AppButton
              color='danger'
              onClick={e => {
                setEditText('');
                setIsEditing(false);
              }}
            >
              X
            </AppButton>
          </InputGroupAddon>
        </InputGroup>
      </ListGroupItem>
    );
  }

  const renderActionButtons = () => {
    return (
      <ButtonGroup>
        {canEdit && handleEdit && (
          <AppButton
            disabled={disableActions}
            onClick={e => setIsEditing(true)}
          >
            Edit
          </AppButton>
        )}
        {canRemove && handleRemove && (
          <AppButton
            disabled={disableActions}
            onClick={e => {
              handleActionClick(e, item, handleRemove);
            }}
          >
            Remove
          </AppButton>
        )}
      </ButtonGroup>
    );
  };

  const renderRow = () => {
    const active = canSelect && isSelected;
    return (
      <ListGroupItem
        key={item.text}
        action={canSelect}
        active={active}
        className='noselect d-flex justify-content-between align-items-center py-1'
        onClick={e => listProps.handleSelectionChange?.(item)}
      >
        {`${rowNumber + 1}. `}
        {item.text}
        {renderActionButtons()}
        {active ? '✅' : '❌'}
      </ListGroupItem>
    );
  };

  if (isEditing) {
    return renderIsEditing();
  } else {
    return renderRow();
  }
};

export default ListRow;
