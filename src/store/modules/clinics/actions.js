import axios from 'axios';
import {
    CLINICS_CREATE,
    CLINICS_PROP_PUSH,
    CLINICS_PROP_SET,
} from '@/constants';

export default {
    [CLINICS_CREATE]: ({
        commit,
        state,
    }, {
        clinic,
    }) => new Promise((resolve, reject) => {
        commit(CLINICS_PROP_SET, { propKey: 'status', propName: 'loading' });
        axios.post('/',
            JSON.stringify({
                jsonrpc: '2.0',
                method: 'Organizations.Edit',
                params: {
                    name: clinic.name,
                    description: clinic.description,
                },
                id: 1,
            }))
            .then((resp) => {
                //! переделать по API resp.data.result
                if (resp.data.error) {
                    commit(CLINICS_PROP_SET, { propKey: 'status', propName: 'error' });
                }
                commit(CLINICS_PROP_SET, { propKey: 'status', propName: 'success' });
                commit(CLINICS_PROP_PUSH, {
                    subPropIndex: state.clinics && state.clinics.length ? state.clinics.length : 0,
                    propName: 'clinics',
                    propValue: resp.data.result,
                });
                resolve(resp.data.result);
            })
            .catch((err) => {
                commit(CLINICS_PROP_SET, { propKey: 'status', propName: 'error' });
                reject(err);
            });
    }),
    [CLINICS_PROP_SET]: ({
        commit,
    }, {
        clinics,
    }) => {
        localStorage.setItem('CLINICS', JSON.stringify(clinics));
        commit(CLINICS_PROP_SET, { propKey: 'clinics', propName: clinics });
    },
};
