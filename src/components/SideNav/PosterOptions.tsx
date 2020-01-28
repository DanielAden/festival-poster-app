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
import {
  changeFestivalName,
  mergePoster,
} from '../../store/Poster/posterSlice';
import useTypedSelector from '../../store/rootReducer';

const optionDebouncRate = 600;

interface PosterOptionsProps {}
const PosterOptions: React.FC<PosterOptionsProps> = () => {
  const dispatch = useDispatch();
  const { festivalName } = useTypedSelector(s => s.poster);

  return (
    <div>
      <AppInput
        initialValue={festivalName}
        onResult={r => dispatch(changeFestivalName(r))}
        placeholder='Festival Name'
        debounceRate={optionDebouncRate}
      />
      <Dates />
    </div>
  );
};

const Dates: React.FC<any> = () => {
  const { showDates, date1 } = useTypedSelector(s => s.poster);
  const dispatch = useDispatch();
  const toggleShowDates = () =>
    dispatch(mergePoster({ showDates: !showDates }));
  const dispatchDate = (key: string, date: string) =>
    dispatch(mergePoster({ [key]: { date } }));
  return (
    <Form>
      <FormGroup check>
        <Label check>
          <Input
            type='checkbox'
            checked={showDates}
            onChange={() => toggleShowDates()}
          />
          Show Festival Dates
        </Label>
      </FormGroup>
      {showDates && (
        <AppInput
          initialValue={date1.date}
          onResult={r => dispatchDate('date1', r)}
          debounceRate={optionDebouncRate}
        />
      )}
    </Form>
  );
};

export default PosterOptions;
