import React, { useState, useCallback } from 'react'
import ListRow from './ListRow'
import AppButton from '../AppButton'
import { ButtonGroup, InputGroup, Input, ListGroup, ListGroupItem } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';


const SELECTALL = 'Select All';
const CLEAR = 'Unselect All'

export interface ListItem {
  id: number;
  text: string;
  canEdit?: boolean;
  isSelected: boolean;
  userAdded?: boolean;
}
// Quick and dirty way to generate probably unique ids, 
// Should serve the purpose for this list implementation
let _ID = -1;
const generateId = () => {
  _ID++;
  return _ID;
} 
export function createNewListItem(oldItem: Omit<ListItem, 'id'>, newItem?: Omit<Partial<ListItem>, 'id'>): ListItem {
  return {
    id: generateId(),
    ...oldItem,
    ...newItem,
  }
}

type UseList = [ListItem[], (items: string[]) => void, Required<ListHandlers>]
export const useList = (handlerCallbacks?: ListHandlers, handlerMiddleware?: ListHandlerMiddleware): UseList => {
  const [list, setList] = useState<ListItem[]>([])

  const setListWrapper = useCallback((items: string[]) => {
    const listItemsMap = (values: string[]) => values.map(v => {
      return createNewListItem({
        text: v,
        isSelected: true,
        canEdit: false,
        userAdded: false,
      })
    })
    setList(listItemsMap(items));
  }, [])

  const listItemHook = attachHandlers(setList, handlerCallbacks, handlerMiddleware);
  return [list, setListWrapper, listItemHook];
}

type UseReduxList = { items: ListItem[], setItems: (items: ListItem[]) => void, listProps: Required<ListHandlers> }
export const useReduxList = ( 
  selectorFN: (state: any) => ListItem[],
  actionFN: (newList: ListItem[]) => void,
): UseReduxList => {
  const items = useSelector(selectorFN);
  const dispatch = useDispatch();
  const listFNSetter: ListSetter = (fn: (oldList: ListItem[]) => ListItem[]) => {
    const newList =  fn(items);
    dispatch(actionFN(newList));
  }
  const setItems = useCallback((items: ListItem[]) => {
    dispatch(actionFN(items));
  }, [dispatch, actionFN])

  const listProps = attachHandlers(listFNSetter);
  return { 
    items: items, 
    setItems, 
    listProps,
  };
}

// TODO use immer produce for all of this
type ListSetter = (fn: (oldList: ListItem[]) => ListItem[]) => void;
export function attachHandlers(
  setter: ListSetter, 
  handlerCallbacks?: ListHandlers,
  handlerMiddleware?: ListHandlerMiddleware, 
): Required<ListHandlers> {
  return {
    handleRemove: (toRemove) => {
      setter((oldItems) => {
        return oldItems.filter(i => i.id !== toRemove.id)
      });
      handlerCallbacks?.handleRemove?.(toRemove);
    },
    handleAddRow: (addedItem) => {
      const newItem = handlerMiddleware?.addRow?.(addedItem) || addedItem;
      setter((oldItems) => {
        return [...oldItems, newItem]
      });
      handlerCallbacks?.handleAddRow?.(newItem);
    },
    handleEdit: (editedItem) => {
      setter((oldItems) => {
        const newItems = [...oldItems];
        let itemToEdit = newItems.find(i => i.id === editedItem.id)
        if (!itemToEdit) throw new Error(`Could not find edited item: ${JSON.stringify(editedItem)}`) 
        itemToEdit.text = editedItem.text;
        return newItems; 
      });
      handlerCallbacks?.handleEdit?.(editedItem);
    },
    handleSelectionChange: (selectedItem) => { 
      setter((oldItems) => {
        return produce(oldItems, (draft) => {
          const i = draft.findIndex(i => i.id === selectedItem.id)
          draft[i].isSelected = !selectedItem.isSelected;
          handlerCallbacks?.handleSelectionChange?.(draft[i]);
        })
      });
    },
    handleSelectAll: () => {
      setter((oldItems) => {
        let newItems = oldItems.map(i => {
          return {...i, isSelected: true}  
        }) 
        const selectAllMW = handlerMiddleware?.selectAll
        if (selectAllMW) {
          newItems = selectAllMW(newItems);
        }
        return newItems; 
      });
    },
    handleClear: () => {
      setter((oldItems) => {
        let newItems = oldItems.map(i => {
          return {...i, isSelected: false}  
        }) 
        const clearMW = handlerMiddleware?.clear
        if (clearMW) {
          newItems = clearMW(newItems);
        }
        return newItems; 
      });
    }
  }
}

export interface ListHandlerMiddleware  {
  addRow?: (item: ListItem) => ListItem; 
  selectAll?: (items: ListItem[]) => ListItem[];
  clear?: (items: ListItem[]) => ListItem[];
}

export type ListHandler = (item: ListItem) => void;
export type ListActionHandler = (actionValue: any) => void;
export interface ListHandlers {
  handleRemove?: ListHandler;
  handleAddRow?: ListHandler; 
  handleEdit?: ListHandler;
  handleSelectionChange?: ListHandler;
  handleSelectAll?: (newItems?: ListItem[]) => void; 
  handleClear?: (newItems?: ListItem[]) => void; 
}
export interface ListProps extends ListHandlers {
  name: string;
  items: ListItem[];
  canRemove?: boolean;
  canAddRow?: boolean;
  canEditGlobal?: boolean;
  canSelect?: boolean;
}


const List: React.FC<ListProps> = (props) => {
  const [isAddingRow, setisAddingRow] = useState(false);
  const [addRowText, setAddRowText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { items } = props;
  const canSelectAll = props.canSelect && props.handleSelectAll;
  const canClear = props.canSelect && props.handleClear;

  const renderAddRow = () => {
    const { handleAddRow, canAddRow } = props;
    if ( !(handleAddRow && canAddRow)) return null;
    if (isAddingRow) return (
      <div>
        <ListGroupItem>
          <InputGroup>
            <Input value={addRowText} onChange={
              (e) => setAddRowText(e.target.value)
            } />
            <ButtonGroup>
              <AppButton onClick={() => {
                const newItem = createNewListItem({
                  text: addRowText,
                  userAdded: true,
                  isSelected: false,
                }, {})
                setisAddingRow(false);
                handleAddRow(newItem);
                setAddRowText('');
              }}>Save</AppButton>
              <AppButton color="danger"
                onClick={() => {
                  setisAddingRow(false);
                  setAddRowText('');
                }}>X</AppButton>
              </ButtonGroup>
          </InputGroup>
        </ListGroupItem>
      </div>
    )
    
    return (
      <ListGroupItem>
        <AppButton block disabled={isEditing} onClick={() => setisAddingRow(true)}>Add Row</AppButton>
      </ListGroupItem>
    )
  }

  const renderListActions = () => {
    let selectAll = null;
    let clear = null;
    if (canSelectAll) {
      selectAll = (
        <AppButton onClick={(e) => {
          props.handleSelectAll?.(); 
        }}>{SELECTALL}</AppButton>
      )
    } 
    if (canClear) {
      clear = (
        <AppButton color="primary" onClick={(e) => {
          props.handleClear?.(); 
        }}>{CLEAR}</AppButton>
      )
    } 
    return (
      <div className="list__actions">
        <ButtonGroup>
          {selectAll}
          {clear}
        </ButtonGroup>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <div className="list__header" style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <h3>{props.name}</h3>
        {renderListActions()}
      </div>
    )
  }

  function renderList() {
    const rows = items.map((item) => {
      return <ListRow key={item.id} 
                      item={item} 
                      setIsEditing={setIsEditing}
                      isEditing={isEditing}
                      disableActions={isAddingRow}
                      {...props} />
    })
    return (
      <div className="list">
        {renderHeader()}
        <ListGroup>
          {rows}
          {renderAddRow()}
        </ListGroup>
      </div>
    )
  }
  return (
    <div className="list"> 
      {renderList()}
    </div>
  )
}

export default List;