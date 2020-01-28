import React, { useState } from 'react';
import './SideNav.css';
import { Button, ButtonGroup } from 'reactstrap';
import ImportArtists from './ImportArtists';
import ArtistList from './ArtistsList';
import PosterOptions from './PosterOptions';

interface Props {
  active: boolean;
  toggle: () => void;
}
const SideNav: React.FC<Props> = ({ active, toggle }) => {
  const [selected, setSelected] = useState(0);
  const width = 300; // active ? 300 : 0;

  const handleSelection = (id: number) => {
    setSelected(id);
  };

  return (
    <div className='sidenav' style={{ width }}>
      <a href='#' className='closebtn' onClick={toggle}>
        &times;
      </a>
      <Selections selectedId={selected} onSelectChange={handleSelection} />
      {selected === 0 && <ImportArtists />}
      {selected === 1 && <ArtistList />}
      {selected === 2 && <PosterOptions />}
    </div>
  );
};

const buttons = ['Import Artists', 'Manage Artists', 'Manage Poster'];
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
