/* eslint-disable */
import {
  LOADER_START,
  LOADER_STOP,
} from '@/constants';

export default {
  [LOADER_START]: (state) => {
  state.loading = true;
  },
  [LOADER_STOP]: (state) => {
  state.loading = false;
  },
};
