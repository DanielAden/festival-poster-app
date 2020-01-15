import {SET_ARTISTLIST_ARTISTS, SET_ARTISTLIST_SEPERATOR, SET_ARTISTLIST_GAP, SET_ARTISTLIST_CASE, SET_ARTISTLIST_COLOR1, SET_ARTISTLIST_COLOR2, SET_ARTISTLIST_COLOR3, ArtistListActionTypes, ArtistListSeperator, ArtistListCase} from './types'
import { ListItem } from '../../components/List/List'

export function setArtistListArtists(newArtists: ListItem[]): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_ARTISTS,
    artists: newArtists, 
  }
}

export function setArtistListSeperator(newSeperator: ArtistListSeperator): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_SEPERATOR,
    seperator: newSeperator, 
  }
}

export function setArtistListGap(newGap: number): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_GAP,
    gap: newGap, 
  }
}

export function setArtistListCase(newCase: ArtistListCase): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_CASE,
    case: newCase, 
  }
}

export function setArtistListColor1(newColor1: string): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_COLOR1,
    color1: newColor1, 
  }
}

export function setArtistListColor2(newColor2: string): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_COLOR2,
    color2: newColor2, 
  }
}

export function setArtistListColor3(newColor3: string): ArtistListActionTypes {
  return {
    type: SET_ARTISTLIST_COLOR3,
    color3: newColor3, 
  }
}