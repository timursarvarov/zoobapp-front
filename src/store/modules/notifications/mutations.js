/* eslint-disable */
import {
  NOTIFY,
} from '@/constants';

export default {
  [NOTIFY]: (state, settings) => {
    state.notify = !state.notify;
    state.message = settings.message;
    state.icon = settings.icon;
    state.horizontalAlign = settings.horizontalAlign ;
    state.verticalAlign = settings.verticalAlign ;
    state.type = settings.type;
    state.status = settings.status ;
  },
};
