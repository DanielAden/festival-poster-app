import React, { useCallback } from 'react';
import { Form, Row, Col } from 'reactstrap';
import AppSelect, { useAppSelect, SelectOption } from './AppSelect/AppSelect';
import AppButton from './AppButton';
import { usePoster } from './Poster/Poster';
import { changeThemeType, changeLayoutType } from '../store/Poster/posterSlice';
import { useDispatch } from 'react-redux';
import useAppSelector from '../store/rootReducer';

const useCreateImage = () => {
  const poster = usePoster();
  const createImage = useCallback(async () => {
    const can = document.createElement('canvas');
    poster.setPosterSize(1600, 2000);
    await poster.draw(can);
    const dataURL = can.toDataURL('png', 1.0);
    const w = window.open('_blank');
    w?.document.write(`<img src=${dataURL}></img>`);
  }, [poster]);
  return createImage;
};

const themeOptions: SelectOption[] = [
  {
    text: 'Desert',
    value: 'desert',
  },
  {
    text: 'Punk',
    value: 'punk',
  },
  {
    text: 'Rock',
    value: 'rock',
  },
  {
    text: 'Galaxy',
    value: 'galaxy',
  },
];

const layoutOptions: SelectOption[] = [
  {
    text: 'Basic',
    value: 'basic',
  },
  {
    text: 'Weekend',
    value: 'weekend',
  },
];

interface Props {}

const Options: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const themeType = useAppSelector(s => s.poster.themeType);
  const layoutType = useAppSelector(s => s.poster.layoutType);

  const [, themeSelectHook] = useAppSelect(themeOptions, themeType, value => {
    dispatch(changeThemeType(value));
  });
  const [, layoutSelectHook] = useAppSelect(
    layoutOptions,
    layoutType,
    value => {
      dispatch(changeLayoutType(value));
    },
  );
  const createImage = useCreateImage();
  return (
    <div className='options mb-2'>
      <Form>
        <Row form>
          <Col md={6} xs={6}>
            <AppSelect labelText={'Theme'} {...themeSelectHook} />
          </Col>
          <Col md={6} xs={6}>
            <AppSelect labelText={'Text Layout'} {...layoutSelectHook} />
          </Col>
          <Col md={6} xs={6}></Col>
        </Row>
      </Form>
      <AppButton color={'warning'} onClick={() => createImage()}>
        Create Image
      </AppButton>
    </div>
  );
};

export default Options;
