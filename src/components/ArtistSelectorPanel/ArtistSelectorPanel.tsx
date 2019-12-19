import React, { useState } from 'react'
import List, {ListItem,  getDefaultListHandlers as attachHandlers, ListHandler, createNewListItem, ListHandlerMiddleware} from '../List/List'


interface Props {
  
}
const test: ListItem[] = ['artist 1', 'artist 2', 'artist 3', 'artist 4', 'artist 5'].map((text) => createNewListItem({ text, canEdit: false, isSelected: false}))
const ArtistSelectorPanel: React.FC<Props> = () => {
  const [sourceList, setSourceList] = useState<ListItem[]>(test);
  const [targetList, setTargetList] = useState<ListItem[]>([]);

  const sourceHandleSelectionChange: ListHandler = (item) => {
    if (item.isSelected) {
      const newItem = createNewListItem(item, {
        isSelected: false, 
        canEdit: false }
      )
      const target = [...targetList, newItem];
      setTargetList(target);
    } else {
      const target = targetList.filter(i => i.text !== item.text)
      setTargetList(target);
    }
  }
  const targetHandleRemove: ListHandler = (item) => {
    const newSource = [...sourceList]
    const newItem = newSource.find(i => i.text === item.text);
    if (!newItem) return;
    newItem.isSelected = false;
    setSourceList(newSource);
  }

  const sourceSelectAllMW = (sourceItems: ListItem[]) => {
    const userAddedList = targetList.filter(i => i.userAdded)
    let newTargetList = [...sourceItems, ...userAddedList];
    setTargetList(newTargetList);
    return sourceItems;
  }

  const sourceClearMW = (sourceItems: ListItem[]) => {
    const sourceItemMap = {} as any;
    sourceItems.forEach(i => {
      sourceItemMap[i.text] = true;
    })
    const newTargetList = targetList.filter(i => {
      return sourceItemMap[i.text] !== true;
    }) 
    setTargetList(newTargetList);
    return sourceItems;
  }

  const targetAddRowMW: ListHandlerMiddleware['addRow'] = (item) => {
    const newItem = createNewListItem(item, { canEdit: true })
    return newItem;
  }
  const sourceHandlers = attachHandlers(setSourceList, {
    handleSelectionChange: sourceHandleSelectionChange
  }, {
    selectAll: sourceSelectAllMW,
    clear: sourceClearMW,
  });
  const targetHandlers = attachHandlers(setTargetList, {
    handleRemove: targetHandleRemove,
  }, {
    addRow: targetAddRowMW, 
  }) 
  return (
    <div className="artist-selector-panel" style={getStyle()}>
      <div style={getListStyle()}>
        <List name={"Artists"} items={sourceList} {...sourceHandlers} canSelect  />
      </div>
      <div style={getListStyle()}>
        <List name={"Artists"} items={targetList} {...targetHandlers} canRemove canEditGlobal canAddRow />
      </div>
    </div>
  )
}


function getStyle(): React.CSSProperties {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    width: '40%',
  } 
}

function getListStyle() {
  return {
    flexGrow: 1,
    flexBasis: 'auto',
    margin: '.5rem',
  }
}

export default ArtistSelectorPanel;