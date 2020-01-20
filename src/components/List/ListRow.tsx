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

export function handleActionClick<T>(
  e: any,
  item: ListItem<T>,
  handler: ListHandler<T>,
) {
  e.preventDefault();
  handler(item);
}

interface Props<T> extends ListProps<T> {
  item: ListItem<T>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<any>;
  disableActions: boolean;
  rowNumber?: number;
}
type FCRow<T = any> = React.FC<Props<T>>;
const ListRow: FCRow = ({
  rowNumber,
  disableActions,
  item,
  isEditing,
  setIsEditing,
  renderData,
  ...listProps
}) => {
  const [editText, setEditText] = useState(item.data);
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
                if (!handleEdit)
                  throw Error('Expected handleEdit to exist by this point');
                handleActionClick(
                  e,
                  createNewListItem(item, { data: editText }),
                  handleEdit,
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
        key={item.id}
        action={canSelect}
        active={active}
        className='noselect d-flex justify-content-between align-items-center py-1'
        onClick={e => listProps.handleSelectionChange?.(item)}
      >
        {typeof rowNumber === 'number' && `${rowNumber + 1}. `}
        {renderData(item.data)}
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
