/* eslint-disable */
import {
    LOADER_START,
    LOADER_STOP,
    LOADER_SWITCH_OFF,
    LOADER_SWITCH_ON,
} from '@/constants';

export default {
    [LOADER_START]: (state) => {
        state.loading = true;
    },
    [LOADER_STOP]: (state) => {
        state.loading = false;
    },
    [LOADER_SWITCH_OFF]: (state) => {
        state.loaderState = false;
    },
    [LOADER_SWITCH_ON]: (state) => {
        state.loaderState = true;
    },
};