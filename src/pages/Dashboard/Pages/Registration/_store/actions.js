import axios from 'axios';
import { USER_ERROR, USER_SUCCESS, USER_REQUEST, USER_REGISTER } from '@/constants';

export default {
    [USER_REGISTER]: ({ commit }, { params }) =>
        new Promise((resolve, reject) => {
            commit(USER_REQUEST);
            axios
                .post(
                    '/',
                    JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'Auth.Registration',
                        params: {
                            username: params.username,
                            firstName: params.firstName,
                            lastName: params.lastName,
                            password: params.password
                        },
                        id: 1
                    })
                )
                .then(resp => {
                    if (resp.data.error) {
                        commit(USER_ERROR);
                        reject(resp.data.error);
                    }
                    commit(USER_SUCCESS);
                    resolve(resp.data.result);
                })
                .catch(err => {
                    commit(USER_ERROR);
                    reject(err);
                });
        })
};
