import React, { useCallback } from 'react';
import { Form, Row, Col } from 'reactstrap';
import AppSelect, { useAppSelect, SelectOption } from './AppSelect/AppSelect';
import AppButton from './AppButton';
import { usePoster } from './Poster/Poster';
import { POSTER_CANVAS_ID } from './Poster/PosterCanvas';
import { changeThemeType, changeLayoutType } from '../store/Poster/posterSlice';
import { useDispatch } from 'react-redux';
import useAppSelector from '../store/rootReducer';

const useCreateImage = () => {
  const theme = usePoster();
  const createImage = useCallback(() => {
    const can = document.getElementById(POSTER_CANVAS_ID) as HTMLCanvasElement;
    if (!can) throw new Error('Expected canvas node');
    theme.postDrawCB = () => {
      const dataURL = can.toDataURL('image/jpeg', 1.0);
      const w = window.open('_blank');
      w?.document.write(`<img src="${dataURL}"></img>`);
    };
    theme.draw(can, true);
  }, [theme]);
  return createImage;
};

const themeOptions: SelectOption[] = [
  {
    text: 'Theme 1',
    value: 'theme1',
  },
  {
    text: 'Theme 2',
    value: 'theme2',
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
    <div>
      <Form>
        <Row form>
          <Col md={6}>
            <AppSelect labelText={'Theme'} {...themeSelectHook} />
          </Col>
          <Col md={6}>
            <AppSelect labelText={'Text Layout'} {...layoutSelectHook} />
          </Col>
        </Row>
      </Form>
      <AppButton color={'warning'} onClick={() => createImage()}>
        Create Image
      </AppButton>
    </div>
  );
};

export default Options;
