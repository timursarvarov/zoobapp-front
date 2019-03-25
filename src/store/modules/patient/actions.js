/* eslint-disable */
import axios from 'axios';
import {
  PATIENT_CREATE,
  PATIENT_REQUEST,
  PATIENT_ERROR,
  PATIENT_SUCCESS,
  PATIENT_DIAGNOSE_SET,
  PATIENT_GET,
  PATIENT_SET_PARAM,
  PATIENT_SET_PARAMS,
  PATIENT_AVATAR_UPLOAD,
  PATIENT_UPDATE,
  PATIENT_CREATE_NOTE,
  PATIENTS_UPDATE_PATIENT,
  PATIENT_ADD_SUB_PROP,
  PATIENT_DOWNLOAD_FILE,
  PATIENT_DIAGNOSE_UPDATE,
} from '@/constants';

export default {
  [PATIENT_AVATAR_UPLOAD]: ({
    commit,
    state,
    dispatch
  }, {
    patient
  }) => {
    return new Promise((resolve, reject) => {
      commit(PATIENT_REQUEST);
      axios.post(`/patients/${patient.ID}/photo/`,
          patient.fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(resp => {
          commit(PATIENT_SUCCESS);
          dispatch(PATIENT_SET_PARAM, {
            type: 'avatar',
            value: resp.data.url,
          })
          const patient = state.patient;
          dispatch(PATIENT_SET_PARAMS, {
            patient: patient
          })
          resolve(resp);
        })
        .catch(err => {
          commit(PATIENT_ERROR);
          reject(err);
        });
    });
  },
  [PATIENT_UPDATE]: ({
    commit,
    dispatch,
  }, {
    patient
  }) => {
    return new Promise((resolve, reject) => {
      commit(PATIENT_REQUEST);
      axios.put(`/patients/${patient.ID}/`,
          JSON.stringify({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: parseInt(patient.phone, 10),
            address: patient.address,
            allergy: patient.allergy,
            source: patient.source,
            color: patient.color,
            rating: parseInt(patient.rating, 10),
          })
        )
        .then(resp => {
          commit(PATIENT_SUCCESS);
          dispatch(PATIENT_SET_PARAMS, {
            patient: resp.data
          });
          resolve(resp);
        })
        .catch(err => {
          commit(PATIENT_ERROR);
          reject(err);
        });
    });
  },
  [PATIENT_CREATE_NOTE]: ({
    commit,
    state,
    dispatch
  }, {
    params
  }) => {
    console.log(params)
    return new Promise((resolve, reject) => {
      commit(PATIENT_REQUEST);
      axios.post(`/patients/${params.patientId}/notes/`,
          JSON.stringify({
            note: params.note,
          })
        )
        .then(resp => {
          commit(PATIENT_SUCCESS);
          let notes = [];
          notes = state.patient.notes;
          notes.unshift(resp.data);
          dispatch(PATIENT_SET_PARAM, {
            type: 'notes',
            value: notes,
          });
          resolve(resp);
        })
        .catch(err => {
          commit(PATIENT_ERROR);
          reject(err);
        });
    });
  },
  [PATIENT_DOWNLOAD_FILE]: ({
  }, {
    params
  }) => {
    console.log(params);
    return new Promise((resolve, reject) => {
      axios({
        url: params.url,
        method: 'GET',
        responseType: 'blob', // important
      })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [PATIENT_ADD_SUB_PROP]: ({
    state,
    dispatch
  }, {
    params
  }) => {
          var {propName, value} = params;
          let props = state.patient[propName];
          props.unshift(value);
          dispatch(PATIENT_SET_PARAM, {
            type: propName,
            value: props,
        });
  },
  [PATIENT_CREATE]: ({
    commit
  }, {
    patient
  }) => {
    return new Promise((resolve, reject) => {
      commit(PATIENT_REQUEST);
      axios.post('/patients/',
          JSON.stringify({
            firstName: patient.firstName,
            lastName: patient.lastName,
            phone: patient.phone,
            email: patient.email,
            allergy: patient.allergy,
            source: patient.source,
            color: patient.color,
          })
        )
        .then(resp => {
          commit(PATIENT_SUCCESS);
          resolve(resp);
        })
        .catch(err => {
          commit(PATIENT_ERROR);
          reject(err);
        });
    });

  },

  [PATIENT_DIAGNOSE_SET]: ({
    commit
  }, {
    diagnose
  }) => {
    commit(PATIENT_DIAGNOSE_SET, diagnose);
  },

  [PATIENT_DIAGNOSE_UPDATE]: ({
    commit,
  }, {
    diagnose
  }) => {
    commit(PATIENT_DIAGNOSE_UPDATE, diagnose);
  },

  [PATIENT_SET_PARAM]: ({
    commit,
  }, {
    type,
    value
  }) => {
    commit(PATIENT_SET_PARAM, {
      type: type,
      value: value,
    });

  },
  [PATIENT_SET_PARAMS]: ({
    commit,
    dispatch
  }, {
    patient
  }) => {
    for (var k in patient) {
      let value = patient[k];
      if (value === null) {
        if (k === 'allergy' || k === 'notes' || k === 'diagnosis'|| k === 'files') {
          value = [];
        }
      }
      commit(PATIENT_SET_PARAM, {
        type: k,
        value: value,
      });
    }
    dispatch(PATIENTS_UPDATE_PATIENT, {
      patient
    });
  },
  [PATIENT_GET]: ({
    commit,
    dispatch
  }, {
    patientId
  }) => {
    return new Promise((resolve, reject) => {
      commit(PATIENT_REQUEST);
      axios.get(`/patients/${patientId}/`)
        .then(resp => {
          dispatch(PATIENT_SET_PARAMS, {
            patient: resp.data
          });
          commit(PATIENT_SUCCESS);
          resolve(resp.data);
        })
        .catch(err => {
          console.log(err);
          commit(PATIENT_ERROR);
          reject(err);
        });
    });
  },
};