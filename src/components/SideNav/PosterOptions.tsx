import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Form,
  Row,
  Col,
  Label,
  FormGroup,
} from 'reactstrap';
import AppInput from '../AppInput/AppInput';
import { useDispatch } from 'react-redux';
import { changeFestivalName } from '../../store/Poster/posterSlice';
import useTypedSelector from '../../store/rootReducer';

interface PosterOptionsProps {}
const PosterOptions: React.FC<PosterOptionsProps> = () => {
  const dispatch = useDispatch();
  const festivalName = useTypedSelector(s => s.poster.festivalName);

  const renderDates = () => {
    return (
      <Form>
        <Row>
          <Col>
            <Label>Start</Label>
            <Input></Input>
          </Col>
          <Col>
            <Label>End</Label>
            <Input></Input>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div>
      <AppInput
        initialValue={festivalName}
        onResultHook={r => dispatch(changeFestivalName(r))}
      />
      <FormGroup check>
        <Label check>
          <Input type='checkbox' />
          Enable Festival Dates
        </Label>
      </FormGroup>

      {renderDates()}
    </div>
  );
};

export default PosterOptions;
