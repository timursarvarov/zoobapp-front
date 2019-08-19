/* eslint-disable */
import {
    LOADER_START,
    LOADER_STOP,
    LOADER_SWITCH_OFF,
    LOADER_SWITCH_ON,
    LOADER_SET_PROP,
} from '@/constants';

export default {
    [LOADER_START]: ({ commit }) => {
        commit(LOADER_SET_PROP, { propKey: 'loading', propValue: true });
    },
    [LOADER_STOP]: ({ commit }) => {
        commit(LOADER_SET_PROP, { propKey: 'loading', propValue: false });
    },
    [LOADER_SWITCH_OFF]: ({ commit }) => {
        commit(LOADER_SET_PROP, { propKey: 'loaderState', propValue: false });
    },
    [LOADER_SWITCH_ON]: ({ commit }) => {
        commit(LOADER_SET_PROP, { propKey: 'loaderState', propValue: true });
    },
};