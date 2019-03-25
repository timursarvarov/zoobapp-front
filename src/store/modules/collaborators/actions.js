/* eslint-disable */
import {
  COLLABORATOR_REQUEST,
  COLLABORATOR_SUCCESS,
  COLLABORATOR_CREATE,
  COLLABORATOR_ERROR,

} from '@/constants';

import axios from 'axios';

export default {
  [COLLABORATOR_CREATE]: ({
    commit
  }, {
    params
  }) => {
    return new Promise((resolve, reject) => {
      commit(COLLABORATOR_REQUEST);
      axios.put('/account/',
          JSON.stringify({
            email: params.email
          })
        )
        .then(resp => {
          commit(COLLABORATOR_SUCCESS);
          resolve(resp);
        })
        .catch(err => {
          commit(COLLABORATOR_ERROR);
          reject(err);
        });
    });
  },
};