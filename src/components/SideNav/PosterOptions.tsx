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
import { usePosterTheme } from '../Poster/PosterTheme';
import AppSelect, { SelectOption, useAppSelect } from '../AppSelect/AppSelect';

const optionDebouncRate = 0;

interface PosterOptionsProps {}
const PosterOptions: React.FC<PosterOptionsProps> = () => {
  const dispatch = useDispatch();
  const { festivalName } = useTypedSelector(s => s.poster);
  const { headlinerLineCount } = usePosterLayout();

  return (
    <div>
      <PresentedBy />
      Festival Name
      <AppInput
        initialValue={festivalName}
        onResult={r => dispatch(changeFestivalName(r))}
        placeholder='Festival Name'
        debounceRate={optionDebouncRate}
      />
      {headlinerLineCount > 0 && <Headliners />}
      <Dates />
    </div>
  );
};

interface HeadlinerProps {}
const PresentedBy: React.FC<HeadlinerProps> = () => {
  const dispatch = useDispatch();
  const presentedBy = useTypedSelector(s => s.poster.presentedBy);
  const showPresentedBy = useTypedSelector(s => s.poster.showPresentedBy);
  const togglePresentedBy = () =>
    dispatch(mergePoster({ showPresentedBy: !showPresentedBy }));

  return (
    <div>
      <FormGroup check>
        <Label check>
          <Input
            type='checkbox'
            checked={showPresentedBy}
            onChange={() => togglePresentedBy()}
          />
          Show Presented By
        </Label>
      </FormGroup>
      {showPresentedBy && (
        <AppInput
          initialValue={presentedBy}
          debounceRate={optionDebouncRate}
          onResult={r => dispatch(mergePoster({ presentedBy: r }))}
        />
      )}
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
        <Label>
          Date One
          <AppInput
            initialValue={date1.date}
            onResult={r => dispatchDate('date1', r)}
            debounceRate={optionDebouncRate}
          />
        </Label>
      )}
      {showDates && dateCount > 1 && (
        <Label>
          Date Two
          <AppInput
            initialValue={date2.date}
            onResult={r => dispatchDate('date2', r)}
            debounceRate={optionDebouncRate}
          />
        </Label>
      )}
      {showDates && dateCount > 2 && (
        <Label>
          Date Three
          <AppInput
            initialValue={date3.date}
            onResult={r => dispatchDate('date3', r)}
            debounceRate={optionDebouncRate}
          />
        </Label>
      )}
    </Form>
  );
};

interface HeadlinerProps {}
const Headliners: React.FC<HeadlinerProps> = () => {
  const artists = useTypedSelector(s => s.poster.artists);
  // const hlLine1 = useTypedSelector(s => s.poster.headliners1);
  const dispatch = useDispatch();
  const options = artists.map(a => {
    return {
      value: a.data.name,
      text: a.data.name,
    };
  });
  const [, artistSelectHook] = useAppSelect(options, '', value => {
    const newHeadliners = [value];
    dispatch(mergePoster({ headliners1: newHeadliners }));
  });

  return <AppSelect labelText={'Headliner (Line 1)'} {...artistSelectHook} />;
};

export default PosterOptions;
