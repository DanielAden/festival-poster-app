import {ArtistListState, ArtistListActionTypes, SET_ARTISTLIST_ARTISTS,SET_ARTISTLIST_SEPERATOR,SET_ARTISTLIST_GAP,SET_ARTISTLIST_CASE,SET_ARTISTLIST_COLOR1,SET_ARTISTLIST_COLOR2,SET_ARTISTLIST_COLOR3} from './types'

const initialState: ArtistListState = {
  artists: [],
  seperator: 'none',
  gap: 0,
  case: 'uppercase',
  color1: '',
  color2: '',
  color3: '',
}

export function artistListReducer(state = initialState, action: ArtistListActionTypes): ArtistListState {
  switch (action.type) {
        case SET_ARTISTLIST_ARTISTS:
        return {...state,
                    artists: action.artists}
    case SET_ARTISTLIST_SEPERATOR:
        return {...state,
                    seperator: action.seperator}
    case SET_ARTISTLIST_GAP:
        return {...state,
                    gap: action.gap}
    case SET_ARTISTLIST_CASE:
        return {...state,
                    case: action.case}
    case SET_ARTISTLIST_COLOR1:
        return {...state,
                    color1: action.color1}
    case SET_ARTISTLIST_COLOR2:
        return {...state,
                    color2: action.color2}
    case SET_ARTISTLIST_COLOR3:
        return {...state,
                    color3: action.color3}
    default:
      return state;
  }
}