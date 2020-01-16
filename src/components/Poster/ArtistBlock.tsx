import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ListItem } from '../List/List';

const dot = 9679;
const artistBlockNameClass = 'artist-block-artist';
const artistBlockClass = 'artist-block';

const FONT_SIZE = '16px';

interface Props {
  posterRect?: DOMRect | null;
}
const ArtistBlock: React.FC<Props> = ({ posterRect }) => {
  const artists = useSelector((s: any) => s.artistList.artists as ListItem[])
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  const renderArtist = (a: string, lastArtist: boolean) => {
    return (
      <span key={a} className={artistBlockNameClass}>
        {a}
        {(!lastArtist) ? String.fromCharCode(dot) : ''}
      </span>
    )
  }

  const style = (): React.CSSProperties => {
    return {
      color: 'rgb(250, 255, 152)',
      position: 'absolute',
      textAlign: 'center',
      fontSize: FONT_SIZE,
      fontWeight: 900,
      top,
    }
  }

  useEffect(() => {
    const artistBlockRect = ref.current?.getBoundingClientRect();
    if (!posterRect) return;
    if (!artistBlockRect) return;
    const top = posterRect.height - artistBlockRect.height;
    setTop(top);
  }, [posterRect,])

  const renderArtists = () => {
    const artistNames = artists.filter(a => a.isSelected).map(a => a.text);
     const artistELs = artistNames.map((a, i, arr) => {
      return renderArtist(a, i === arr.length - 1);
    })
    return artistELs;
  }

  return (
    <div ref={ref} className={artistBlockClass} style={style()}>
      {renderArtists()}
    </div>
  )
}

export default ArtistBlock;