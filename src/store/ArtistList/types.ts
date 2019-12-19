

export interface ArtistListState {
  artists: string[];
  seperator: ArtistListSeperator; // none dot
  gap: number;
  case: ArtistListCase; // uppercase lowercase none
  color1: string;
  color2: string;
  color3: string;
}

export const SET_ARTISTLIST_ARTISTS = 'SET_ARTISTLIST_ARTISTS';
export interface SetArtistlistArtistsAction {
  type: typeof SET_ARTISTLIST_ARTISTS;
  artists: string[];
}

export type ArtistListSeperator = 'none' | 'dot';
export const SET_ARTISTLIST_SEPERATOR = 'SET_ARTISTLIST_SEPERATOR';
export interface SetArtistlistSeperatorAction {
  type: typeof SET_ARTISTLIST_SEPERATOR;
  seperator: ArtistListSeperator;
}

export const SET_ARTISTLIST_GAP = 'SET_ARTISTLIST_GAP';
export interface SetArtistlistGapAction {
  type: typeof SET_ARTISTLIST_GAP;
  gap: number;
}

export type ArtistListCase = 'uppercase' | 'lowercase' | 'none';
export const SET_ARTISTLIST_CASE = 'SET_ARTISTLIST_CASE';
export interface SetArtistlistCaseAction {
  type: typeof SET_ARTISTLIST_CASE;
  case: ArtistListCase;
}

export const SET_ARTISTLIST_COLOR1 = 'SET_ARTISTLIST_COLOR1';
export interface SetArtistlistColor1Action {
  type: typeof SET_ARTISTLIST_COLOR1;
  color1: string;
}

export const SET_ARTISTLIST_COLOR2 = 'SET_ARTISTLIST_COLOR2';
export interface SetArtistlistColor2Action {
  type: typeof SET_ARTISTLIST_COLOR2;
  color2: string;
}

export const SET_ARTISTLIST_COLOR3 = 'SET_ARTISTLIST_COLOR3';
export interface SetArtistlistColor3Action {
  type: typeof SET_ARTISTLIST_COLOR3;
  color3: string;
}

export type ArtistListActionTypes = SetArtistlistArtistsAction | SetArtistlistSeperatorAction | SetArtistlistGapAction | SetArtistlistCaseAction | SetArtistlistColor1Action | SetArtistlistColor2Action | SetArtistlistColor3Action;
