import city from '../../images/city.jpg' 
import fireworks from '../../images/fireworks.jpg' 

export interface PosterTheme {
  image: string;
  artistTextHeight: number;
  artistFont: string;
  festivalNameHeight: number;
  festivalNameFont: string;
  fontColor: string;
  seperator: string;
}

const theme1: PosterTheme = {
  image: fireworks,
  artistTextHeight: 20,
  artistFont: `${20}px serif`,
  festivalNameHeight: 96,
  festivalNameFont: `${96}px serif`,
  fontColor: 'tomato',
  seperator: String.fromCharCode(8226),
}

const theme2: PosterTheme = {
  image: city,
  artistTextHeight: 25,
  artistFont: `${25}px serif`,
  festivalNameHeight: 96,
  festivalNameFont: `${96}px serif`,
  fontColor: 'pink',
  seperator: String.fromCharCode(9830),
}



export const getPosterTheme = (themeType: string): PosterTheme => {
  switch(themeType) {
    case 'theme1': return theme1;
    case 'theme2': return theme2;
    default:
      throw new Error('Invalid theme');
  }
}