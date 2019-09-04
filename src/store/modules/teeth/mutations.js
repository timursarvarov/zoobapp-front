/* eslint-disable */
import {
    TEETH_INITIATION,
    TEETH_INITIATION_ETHALON
} from '@/constants';

export default {
    [TEETH_INITIATION]: (state, { type, value }) => {
        if (!state.jaw) {
            state.jaw = {};
        }
        state.jaw[type] = value;
    },
    [TEETH_INITIATION_ETHALON]: (state, jaw) => {
        state.jawEthalon = jaw;
    },
};