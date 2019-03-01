/* eslint-disable */
import {
  COLLABORATOR_REQUEST,
  COLLABORATOR_SUCCESS,
  COLLABORATOR_ERROR,
} from '../constants';

export default {
  [COLLABORATOR_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [COLLABORATOR_SUCCESS]: (state) => {
    state.status = 'success';
  },
  [COLLABORATOR_ERROR]: (state) => {
    state.status = 'error';
  },
};