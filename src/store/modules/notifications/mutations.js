/* eslint-disable */
import {
  NOTIFY,
} from '@/constants';

export default {
  [NOTIFY]: (state, settings) => {
    state.getNotify = settings;
    state.notify = !state.notify;
  },
};
