/* eslint-disable */
import {
  NOTIFY,
} from '@/constants';

export default {
  [NOTIFY]: ({
    commit
  }, {
    settings
  }) => {
    let set = settings;
    if( set.message ) {
      const nvalue = set.message.toString();
      set.message = nvalue.charAt(0).toUpperCase() + nvalue.slice(1);
    }
    let vSettings = {};
    if (set) {
      vSettings = {
        message:  set.message  || 'OOPS! Something went wrong...',
        icon: set.icon || 'add_alert',
        horizontalAlign: set.horizontalAlign || 'left',
        verticalAlign: set.verticalAlign || 'bottom',
        type: set.type || '.alert-warning',
        status: set.status || '',
      };
    } else {
      vSettings = {
        message: 'OOPS! Something wrong...',
        icon: 'add_alert',
        horizontalAlign: 'left',
        verticalAlign: 'bottom',
        type: 'warning',
        status: '',
      };
    }
    commit(NOTIFY, vSettings);
  },
};