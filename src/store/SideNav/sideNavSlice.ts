import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import produce from 'immer';

interface SideNavState {
  isOpen: boolean;
  selectedOption: number;
}

const initialState: SideNavState = {
  isOpen: false,
  selectedOption: 0,
};

const sideNavSlice = createSlice({
  name: 'sidenav',
  initialState,
  reducers: {
    sideNavSelectionChange(
      state,
      action: PayloadAction<SideNavState['selectedOption']>,
    ) {
      return produce(state, draft => {
        draft.selectedOption = action.payload;
      });
    },
    setSideNavOpen(state, action: PayloadAction<SideNavState['isOpen']>) {
      return produce(state, draft => {
        draft.isOpen = action.payload;
      });
    },
    toggleSideNav(state) {
      return produce(state, draft => {
        draft.isOpen = !draft.isOpen;
      });
    },
  },
});

export const {
  sideNavSelectionChange,
  setSideNavOpen,
  toggleSideNav,
} = sideNavSlice.actions;
export default sideNavSlice.reducer;
