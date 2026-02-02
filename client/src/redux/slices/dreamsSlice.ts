import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MoodType } from '../api/dreamsApi';

interface FiltersState {
  search: string;
  mood: MoodType | '';
  isLucid: boolean | null;
  startDate: string;
  endDate: string;
  tags: string[];
  sort: 'date' | '-date' | 'title' | '-title';
}

interface DreamsState {
  filters: FiltersState;
  view: 'grid' | 'list';
}

const initialState: DreamsState = {
  filters: {
    search: '',
    mood: '',
    isLucid: null,
    startDate: '',
    endDate: '',
    tags: [],
    sort: '-date',
  },
  view: 'grid',
};

const dreamsSlice = createSlice({
  name: 'dreams',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setMoodFilter: (state, action: PayloadAction<MoodType | ''>) => {
      state.filters.mood = action.payload;
    },
    setLucidFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.isLucid = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.filters.startDate = action.payload.start;
      state.filters.endDate = action.payload.end;
    },
    setTagsFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.tags = action.payload;
    },
    setSort: (state, action: PayloadAction<FiltersState['sort']>) => {
      state.filters.sort = action.payload;
    },
    setView: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.view = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSearch,
  setMoodFilter,
  setLucidFilter,
  setDateRange,
  setTagsFilter,
  setSort,
  setView,
  clearFilters,
} = dreamsSlice.actions;

export default dreamsSlice.reducer;
