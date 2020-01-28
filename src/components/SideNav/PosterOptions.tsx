import React from 'react';
import { Input, Form, Label, FormGroup } from 'reactstrap';
import AppInput from '../AppInput/AppInput';
import { useDispatch } from 'react-redux';
import {
  changeFestivalName,
  mergePoster,
} from '../../store/Poster/posterSlice';
import useTypedSelector from '../../store/rootReducer';
import { usePosterLayout } from '../Poster/PosterTextLayout';

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
  const { dateCount } = usePosterLayout();
  const { showDates, date1, date2, date3 } = useTypedSelector(s => s.poster);
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
      {showDates && dateCount > 1 && (
        <AppInput
          initialValue={date2.date}
          onResult={r => dispatchDate('date2', r)}
          debounceRate={optionDebouncRate}
        />
      )}
      {showDates && dateCount > 2 && (
        <AppInput
          initialValue={date3.date}
          onResult={r => dispatchDate('date3', r)}
          debounceRate={optionDebouncRate}
        />
      )}
    </Form>
  );
};

export default PosterOptions;
