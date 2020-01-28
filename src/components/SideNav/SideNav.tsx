import React from 'react';
import './SideNav.css';
import { Button, ButtonGroup } from 'reactstrap';
import ImportArtists from './ImportArtists';
import ArtistList from './ArtistsList';
import PosterOptions from './PosterOptions';
import useTypedSelector from '../../store/rootReducer';
import {
  sideNavSelectionChange,
  toggleSideNav,
} from '../../store/SideNav/sideNavSlice';
import { useDispatch } from 'react-redux';

interface Props {}
const SideNav: React.FC<Props> = () => {
  const isOpen = useTypedSelector(s => s.sidenav.isOpen);
  const selectedOption = useTypedSelector(s => s.sidenav.selectedOption);
  const dispatch = useDispatch();
  const width = isOpen ? 300 : 0;

  const handleSelection = (id: number) => {
    dispatch(sideNavSelectionChange(id));
  };

  return (
    <div className='sidenav' style={{ width }}>
      <a
        href='#'
        className='closebtn'
        onClick={() => dispatch(toggleSideNav())}
      >
        &times;
      </a>
      <Selections
        selectedId={selectedOption}
        onSelectChange={handleSelection}
      />
      {selectedOption === 0 && <ImportArtists />}
      {selectedOption === 1 && <ArtistList />}
      {selectedOption === 2 && <PosterOptions />}
    </div>
  );
};

const buttons = ['Import Artists', 'Manage Artists', 'Advanced Options'];
interface SelectionsProps {
  selectedId: number;
  onSelectChange: (id: number) => void;
}
const Selections: React.FC<SelectionsProps> = ({
  onSelectChange,
  selectedId,
}) => {
  const setClass = (id: number) =>
    id === selectedId ? 'btn-success btn-sm mb-1' : 'btn-sm mb-1';
  return (
    <ButtonGroup toggle aria-label='Option Selection'>
      {buttons.map((b, i) => {
        return (
          <Button
            className={`${setClass(i)}`}
            onClick={() => onSelectChange(i)}
          >
            {b}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default SideNav;
