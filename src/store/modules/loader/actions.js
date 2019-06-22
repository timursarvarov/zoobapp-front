/* eslint-disable */
import {
    LOADER_START,
    LOADER_STOP,
    LOADER_SWITCH_OFF,
    LOADER_SWITCH_ON,
} from '@/constants';

export default {
    [LOADER_START]: ({ commit }) => {
        commit(LOADER_START);
    },
    [LOADER_STOP]: ({ commit }) => {
        commit(LOADER_STOP);
    },
    [LOADER_SWITCH_OFF]: ({ commit }) => {
        commit(LOADER_SWITCH_OFF);
    },
    [LOADER_SWITCH_ON]: ({ commit }) => {
        commit(LOADER_SWITCH_ON);
    },
};