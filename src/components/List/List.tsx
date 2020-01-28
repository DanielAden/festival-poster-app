import React, { useState, useCallback } from 'react';
import ListRow from './ListRow';
import AppButton from '../AppButton';
import {
  ButtonGroup,
  InputGroup,
  Input,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';

const SELECTALL = 'Select All';
const CLEAR = 'Unselect All';

export interface ListItem<T> {
  id: number;
  data: T;
  canEdit?: boolean;
  isSelected: boolean;
  userAdded?: boolean;
}
export type ListItems<T> = ListItem<T>[];
// Quick and dirty way to generate probably unique ids,
// Should serve the purpose for this list implementation
let _ID = -1;
const generateId = () => {
  _ID++;
  return _ID;
};

export function mapToListItems<T>(items: T[]): ListItems<T> {
  return items.map(i => {
    return createNewListItem<T>({
      data: i,
      isSelected: true,
      canEdit: false,
      userAdded: false,
    });
  });
}

export function createNewListItem<T>(
  oldItem: Omit<ListItem<T>, 'id'>,
  newItem?: Omit<Partial<ListItem<T>>, 'id'>,
): ListItem<T> {
  return {
    id: generateId(),
    ...oldItem,
    ...newItem,
  };
}

type UseList<T> = [
  ListItems<T>,
  (items: T[]) => void,
  Required<ListHandlers<T>>,
];
export function useList<T>(
  handlerCallbacks?: ListHandlers<T>,
  handlerMiddleware?: ListHandlerMiddleware<T>,
): UseList<T> {
  const [list, setList] = useState<ListItems<T>>([]);

  const setListWrapper = useCallback((dataList: T[]) => {
    const items = dataList.map(data => {
      return createNewListItem({
        data: data,
        isSelected: true,
        canEdit: false,
        userAdded: false,
      });
    });
    setList(items);
  }, []);

  const listItemHook = attachHandlers(
    setList,
    handlerCallbacks,
    handlerMiddleware,
  );
  return [list, setListWrapper, listItemHook];
}

type UseReduxList<T> = {
  items: ListItems<T>;
  setItems: (items: ListItems<T>) => void;
  listProps: Omit<ListProps<T>, 'items'>;
};
export function useReduxList<T>(
  selectorFN: (state: any) => ListItems<T>,
  actionFN: (newList: ListItems<T>) => void,
  renderData: (data: T) => JSX.Element | string,
): UseReduxList<T> {
  const items = useSelector(selectorFN);
  const dispatch = useDispatch();
  const listFNSetter: ListSetter<T> = (
    fn: (oldList: ListItems<T>) => ListItems<T>,
  ) => {
    const newList = fn(items);
    dispatch(actionFN(newList));
  };
  const setItems = useCallback(
    (items: ListItems<T>) => {
      dispatch(actionFN(items));
    },
    [dispatch, actionFN],
  );

  const listProps = { ...attachHandlers(listFNSetter), renderData };
  return {
    items: items,
    setItems,
    listProps,
  };
}

// TODO use immer produce for all of this
type ListSetter<T> = (fn: (oldList: ListItems<T>) => ListItems<T>) => void;
export function attachHandlers<T>(
  setter: ListSetter<T>,
  handlerCallbacks?: ListHandlers<T>,
  handlerMiddleware?: ListHandlerMiddleware<T>,
): Required<ListHandlers<T>> {
  return {
    handleRemove: toRemove => {
      setter(oldItems => {
        return oldItems.filter(i => i.id !== toRemove.id);
      });
      handlerCallbacks?.handleRemove?.(toRemove);
    },
    handleAddRow: addedItem => {
      const newItem = handlerMiddleware?.addRow?.(addedItem) || addedItem;
      setter(oldItems => {
        return [...oldItems, newItem];
      });
      handlerCallbacks?.handleAddRow?.(newItem);
    },
    handleEdit: editedItem => {
      setter(oldItems => {
        const newItems = [...oldItems];
        let itemToEdit = newItems.find(i => i.id === editedItem.id);
        if (!itemToEdit)
          throw new Error(
            `Could not find edited item: ${JSON.stringify(editedItem)}`,
          );
        itemToEdit.data = editedItem.data;
        return newItems;
      });
      handlerCallbacks?.handleEdit?.(editedItem);
    },
    handleSelectionChange: selectedItem => {
      setter(oldItems => {
        return produce(oldItems, draft => {
          const i = draft.findIndex(i => i.id === selectedItem.id);
          draft[i].isSelected = !selectedItem.isSelected;
          handlerCallbacks?.handleSelectionChange?.(draft[i] as ListItem<T>);
        });
      });
    },
    handleSelectAll: () => {
      setter(oldItems => {
        let newItems = oldItems.map(i => {
          return { ...i, isSelected: true };
        });
        const selectAllMW = handlerMiddleware?.selectAll;
        if (selectAllMW) {
          newItems = selectAllMW(newItems);
        }
        return newItems;
      });
    },
    handleClear: () => {
      setter(oldItems => {
        let newItems = oldItems.map(i => {
          return { ...i, isSelected: false };
        });
        const clearMW = handlerMiddleware?.clear;
        if (clearMW) {
          newItems = clearMW(newItems);
        }
        return newItems;
      });
    },
  };
}

export interface ListHandlerMiddleware<T> {
  addRow?: (item: ListItem<T>) => ListItem<T>;
  selectAll?: (items: ListItems<T>) => ListItems<T>;
  clear?: (items: ListItems<T>) => ListItems<T>;
}

export type ListHandler<T> = (item: ListItem<T>) => void;
export type ListActionHandler = (actionValue: any) => void;
export interface ListHandlers<T> {
  handleRemove?: ListHandler<T>;
  handleAddRow?: ListHandler<T>;
  handleEdit?: ListHandler<T>;
  handleSelectionChange?: ListHandler<T>;
  handleSelectAll?: (newItems?: ListItem<T>[]) => void;
  handleClear?: (newItems?: ListItems<T>) => void;
}
export interface ListProps<T> extends ListHandlers<T> {
  items: ListItems<T>;
  renderData: (data: T) => JSX.Element | string;
  name?: string;
  canRemove?: boolean;
  canAddRow?: boolean;
  canEditGlobal?: boolean;
  canSelect?: boolean;
  rowNumbers?: boolean;
  canSelectAll?: boolean;
}

type FCList<T = any> = React.FC<ListProps<T>>;
const List: FCList = props => {
  const [isAddingRow, setisAddingRow] = useState(false);
  const [addRowText, setAddRowText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { items } = props;
  const canSelectAll =
    props.canSelect && props.canSelectAll && props.handleSelectAll;
  const canClear = props.canSelect && props.canSelectAll && props.handleClear;

  const renderAddRow = () => {
    const { handleAddRow, canAddRow } = props;
    if (!(handleAddRow && canAddRow)) return null;
    if (isAddingRow)
      return (
        <div>
          <ListGroupItem>
            <InputGroup>
              <Input
                value={addRowText}
                onChange={e => setAddRowText(e.target.value)}
              />
              <ButtonGroup>
                <AppButton
                  onClick={() => {
                    const newItem = createNewListItem(
                      {
                        data: addRowText,
                        userAdded: true,
                        isSelected: false,
                      },
                      {},
                    );
                    setisAddingRow(false);
                    handleAddRow(newItem);
                    setAddRowText('');
                  }}
                >
                  Save
                </AppButton>
                <AppButton
                  color='danger'
                  onClick={() => {
                    setisAddingRow(false);
                    setAddRowText('');
                  }}
                >
                  X
                </AppButton>
              </ButtonGroup>
            </InputGroup>
          </ListGroupItem>
        </div>
      );

    return (
      <ListGroupItem>
        <AppButton
          block
          disabled={isEditing}
          onClick={() => setisAddingRow(true)}
        >
          Add Row
        </AppButton>
      </ListGroupItem>
    );
  };

  const renderListActions = () => {
    let selectAll = null;
    let clear = null;
    if (canSelectAll) {
      selectAll = (
        <AppButton
          color='success'
          onClick={e => {
            props.handleSelectAll?.();
          }}
        >
          {SELECTALL}
        </AppButton>
      );
    }
    if (canClear) {
      clear = (
        <AppButton
          color='warning'
          onClick={e => {
            props.handleClear?.();
          }}
        >
          {CLEAR}
        </AppButton>
      );
    }
    return (
      <div className='list__actions'>
        <ButtonGroup>
          {selectAll}
          {clear}
        </ButtonGroup>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div
        className='list__header'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {props.name ? <h3>{props.name}</h3> : null}
        {renderListActions()}
      </div>
    );
  };

  function renderList() {
    const rows = items.map((item, i) => {
      const rowNumber = props.rowNumbers ? i : undefined;
      return (
        <ListRow
          key={item.id}
          item={item}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          disableActions={isAddingRow}
          rowNumber={rowNumber}
          {...props}
        />
      );
    });
    return (
      <div className='list'>
        {renderHeader()}
        <ListGroup>
          {rows}
          {renderAddRow()}
        </ListGroup>
      </div>
    );
  }
  return <div className='list'>{renderList()}</div>;
};

export default List;
