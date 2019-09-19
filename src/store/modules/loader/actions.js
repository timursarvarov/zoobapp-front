/* eslint-disable */
import {
    LOADER_START,
    LOADER_STOP,
    LOADER_SWITCH_OFF,
    LOADER_SWITCH_ON,
    LOADER_SET_PROP,
    JAW_LOADER_STOP,
    JAW_LOADER_START,
} from '@/constants';

export default {
    [JAW_LOADER_START]: ({ commit }) => {
        commit(LOADER_SET_PROP, { propKey: 'isCalculatingJaw', propValue: true });
    },
    [JAW_LOADER_STOP]: ({ commit }) => {
        commit(LOADER_SET_PROP, { propKey: 'isCalculatingJaw', propValue: false });
    },
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
