import DIAGNOSISL from './diagnose';
import TREATMETSL from './procedures';
import MANIPULATIONSl from './manipulations';

import TEETH_DEFAULT_LOCATIONSL from './tooth-default-locations';
import TEETH_SCHEMAL from './teeth-schema';

import TEETH_ADDULT_BOTTOML from './teeth-adult-bottom';
import TEETH_ADDULT_TOPL from './teeth-adult-top';
import TEETH_ADDULT_ALLL from './teeth-adult-all';

import TEETH_BABY_ALLL from './teeth-baby-all';
import TEETH_BABY_TOPL from './teeth-baby-top';
import TEETH_BABY_BOTTOML from './teeth-baby-bottom';

import TEETH_ALLL from './teeth-all';

import TIMEZONESL from './timezones';
import COMMON_CURRENCYL from './common-currency';

export const DIAGNOSIS = DIAGNOSISL;
export const PROCEDURES = TREATMETSL;
export const MANIPULATIONS = MANIPULATIONSl;

// Teeth schema locations

export const TEETH_DEFAULT_LOCATIONS = TEETH_DEFAULT_LOCATIONSL;
export const TEETH_SCHEMA = TEETH_SCHEMAL;

export const TEETH_ADDULT_BOTTOM = TEETH_ADDULT_BOTTOML;
export const TEETH_ADDULT_TOP = TEETH_ADDULT_TOPL;
export const TEETH_ADDULT_ALL = TEETH_ADDULT_ALLL;

export const TEETH_BABY_BOTTOM = TEETH_BABY_BOTTOML;
export const TEETH_BABY_ALL = TEETH_BABY_ALLL;
export const TEETH_BABY_TOP = TEETH_BABY_TOPL;

export const TEETH_ALL = TEETH_ALLL;

export const TIMEZONES = TIMEZONESL;

export const COMMON_CURRENCY = COMMON_CURRENCYL;

// Constants Declaration

// Auth
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';
export const AUTH_LOCK = 'AUTH_LOCK';
export const AUTH_REFRESH_TOKEN = 'AUTH_REFRESH_TOKEN';
export const AUTH_DECODE_TOKEN = 'AUTH_DECODE_TOKEN';
export const AUTH_REFRESH_ERROR = 'AUTH_REFRESH_ERROR';

// User
export const USER_AVATAR_UPLOAD = 'USER_AVATAR_UPLOAD';
export const USER_REQUEST = 'USER_REQUEST';
export const USER_UPDATE = 'USER_UPDATE';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_ERROR = 'USER_ERROR';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_INITIAL = 'USER_INITIAL';
export const USER_SET_PARAMS = 'USER_SET_PARAMS';
export const USER_SET_PARAM = 'USER_SET_PARAM';
export const USER_UPDATE_PASSWORD = 'USER_UPDATE_PASSWORD';
export const USER_SAVE_TO_LOCAL_STORAGE = 'USER_SAVE_TO_LOCAL_STORAGE';
export const USER_REGISTER = 'USER_REGISTER';

// Collaborators
export const COLLABORATOR_REQUEST = 'COLLABORATOR_REQUEST';
export const COLLABORATOR_SUCCESS = 'COLLABORATOR_SUCCESS';
export const COLLABORATOR_CREATE = 'COLLABORATOR_CREATE';
export const COLLABORATOR_ERROR = 'COLLABORATOR_ERROR';

// Notification
export const NOTIFY = 'NOTIFY';

// Loader
export const LOADER_STOP = 'LOADER_STOP';
export const LOADER_START = 'LOADER_START';

// Patients
export const PATIENTS_REQUEST = 'PATIENTS_REQUEST';
export const PATIENTS_SUCCESS = 'PATIENTS_SUCCESS';
export const PATIENTS_ERROR = 'PATIENTS_ERROR';
export const PATIENTS_SET = 'PATIENTS_SET';
export const PATIENTS_UPDATE_PATIENT = 'PATIENTS_UPDATE_PATIENT';

// Patients
export const PATIENT_CREATE = 'PATIENT_CREATE';
export const PATIENT_REQUEST = 'PATIENT_REQUEST';
export const PATIENT_SUCCESS = 'PATIENT_SUCCESS';
export const PATIENT_ERROR = 'PATIENT_ERROR';
export const PATIENT_AVATAR_UPLOAD = 'PATIENT_AVATAR_UPLOAD';
export const PATIENT_UPDATE = 'PATIENT_UPDATE';
export const PATIENT_LOGOUT = 'PATIENT_LOGOUT';
export const PATIENT_PLAN_SET = 'PATIENT_PLAN_SET';
export const PATIENT_PLAN_DELETE = 'PATIENT_PLAN_DELETE';
export const PATIENT_PLAN_EDIT = 'PATIENT_PLAN_EDIT';
export const PATIENT_PROCEDURES_SET = 'PATIENT_PROCEDURESS_SET';
export const PATIENT_TREATMETS_DELETE = 'PATIENT_TREATMETS_DELETE';
export const PATIENT_TREATMETS_UPDATE = 'PATIENT_TREATMETS_UPDATE';
export const PATIENT_DIAGNOSE_SET = 'PATIENT_DIAGNOSE_SET';
export const PATIENT_DIAGNOSE_DELETE = 'PATIENT_DIAGNOSE_DELETE';
export const PATIENT_DIAGNOSE_UPDATE = 'PATIENT_DIAGNOSE_UPDATE';
export const PATIENT_TOGGLE_ITEM_VISIBILITY = 'PATIENT_TOGGLE_ITEM_VISIBILITY';
export const PATIENT_GET = 'PATIENT_GET';
export const PATIENT_SET_PARAM = 'PATIENT_SET_PARAM';
export const PATIENT_SET_PARAMS = 'PATIENT_SET_PARAMS';
export const PATIENT_CREATE_NOTE = 'PATIENT_CREATE_NOTE';
export const PATIENT_ADD_SUB_PROP = 'PATIENT_ADD_SUB_PROP';
export const PATIENT_DOWNLOAD_FILE = 'PATIENT_DOWNLOAD_FILE';

// Clinic
export const CLINIC_REQUEST = 'CLINIC_REQUEST';
export const CLINIC_UPDATE = 'CLINIC_UPDATE';
export const CLINIC_SUCCESS = 'CLINIC_SUCCESS';
export const CLINIC_ERROR = 'CLINIC_ERROR';
export const CLINIC_SET = 'CLINIC_SET';
export const CLINIC_LOGO_UPLOAD = 'CLINIC_LOGO_UPLOAD';

export const CLINICS_REQUEST = 'CLINICS_REQUEST';
export const CLINICS_ERROR = 'CLINICS_ERROR';
export const CLINICS_SUCCESS = 'CLINICS_SUCCESS';
export const CLINICS_CREATE = 'CLINICS_CREATE';

// Diagnosis
export const DIAGNOSIS_REQUEST = 'DIAGNOSIS_REQUEST';
export const DIAGNOSIS_UPDATE = 'DIAGNOSIS_UPDATE';
export const DIAGNOSIS_SUCCESS = 'DIAGNOSIS_SUCCESS';
export const DIAGNOSIS_ERROR = 'DIAGNOSIS_ERROR';
export const DIAGNOSIS_SET = 'DIAGNOSIS_SET';

// Teeth
export const TEETH_INITIATION = 'TEETH_INITIATION';
export const TEETH_INITIATION_ETHALON = 'TEETH_INITIATION_ETHALON';

// Company
export const COMPANY_NAME = 'Dental CRM';
export const COMPANY_LOGO_URL = 'https://s3.envato.com/files/247286010/owl-logo.png';
export const COMPANY_COLOR = '#43a047';
export const COMPANY_LINK = 'https://dental.owl.team';