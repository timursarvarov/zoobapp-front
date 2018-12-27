/* eslint-disable */
import {
  NOTIFY,
} from '../constants';

export default {
  [NOTIFY]: ({commit},{settings}) => {
    console.log(settings);
    let vSettings ={};
    if(settings) {
      vSettings = {
        message: settings.message ||'OOPS! Something went wrong...',
        icon: settings.icon ||'add_alert',
        horizontalAlign: settings.horizontalAlign ||'left',
        verticalAlign: settings.verticalAlign ||'bottom',
        type: settings.type ||'warning',
        status: settings.status ||'',
      };
    }else{
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
