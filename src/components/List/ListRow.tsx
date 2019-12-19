import React, { useState } from 'react'
import { ListItem, createNewListItem, ListHandler, ListProps } from './List'
import { InputGroupAddon, Input, InputGroup, ListGroupItem, ButtonGroup, Container, Row, Col } from 'reactstrap';
import AppButton from '../AppButton'


export function handleActionClick(e: any, item: ListItem, handler: ListHandler) {
  e.preventDefault();
  handler(item);
}


interface Props extends ListProps {
  item: ListItem, 
}
const ListRow: React.FC<Props> = ({ item, ...listProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const { handleRemove, handleEdit, handleSelectionChange: handleSelect } = listProps;
  const canEdit = listProps.canEditGlobal && item.canEdit && handleEdit; 
  const canRemove = !!(listProps.canRemove && handleRemove)
  const canSelect = !!(listProps.canSelect && handleSelect !== undefined);
  const isSelected = !!(item.isSelected);

  function renderIsEditing() {
    return (
      <ListGroupItem>
        <InputGroup>
          <Input value={editText} style={{
            display: 'inline',
          }} onChange={ (e) => {
            setEditText(e.target.value);
          }} /> 

          <InputGroupAddon addonType="append">
            <AppButton onClick={(e) => {
              handleActionClick(e, createNewListItem(item, {text: editText}), handleEdit as ListHandler);
              setEditText('');
              setIsEditing(false);
            }}>Save</AppButton>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <AppButton onClick={(e) => {
              setEditText('');
              setIsEditing(false);
            }}>X</AppButton>
          </InputGroupAddon>
        </InputGroup>
      </ListGroupItem>
    )
  }

  const renderActionButtons = () => {
    return (
      <ButtonGroup>
        {canEdit && handleEdit && 
          <AppButton onClick={(e) => setIsEditing(true)}>Edit</AppButton>}

        {canRemove && handleRemove &&
          <AppButton onClick={(e) => {handleActionClick(e, item, handleRemove)}}>Remove</AppButton>}
      </ButtonGroup>
    )
  }

  if (isEditing) return renderIsEditing();
  return (
    <ListGroupItem key={item.text} action={canSelect} active={canSelect && isSelected} 
                   onClick={ (e) => listProps.handleSelectionChange?.(item) }>
      <Container>
        <Row>
          <Col>
            {item.text}
          </Col>
          <Col>
            {renderActionButtons()}
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  )
}

export default ListRow;

