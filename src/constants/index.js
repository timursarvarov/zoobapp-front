// import PROCEDURES_L from './procedures';
import LOCATIONS_L from './locations';
import JAw_ETHALON_L from './jawEthalon';

import TEETH_DEFAULT_LOCATIONS_L from './tooth-default-locations';
import TEETH_SCHEMA_L from './teeth-schema';

import TEETH_ADDULT_BOTTOM_L from './teeth-adult-bottom';
import TEETH_ADDULT_TOP_L from './teeth-adult-top';
import TEETH_ADDULT_ALL_L from './teeth-adult-all';

import TEETH_BABY_ALL_L from './teeth-baby-all';
import TEETH_BABY_TOP_L from './teeth-baby-top';
import TEETH_BABY_BOTTOM_L from './teeth-baby-bottom';

import TEETH_ALL_L from './teeth-all';

import TIMEZONES_L from './timezones';
import COMMON_CURRENCY_L from './common-currency';

import SERVER_ERRORS_L from './server-errors';
import UPLOAD_FILE_SETTINGS_L from './upload-file-settings';
import LOCAL_STORAGE_L from './localStorage-items';
import AVAILABLE_LANGUAGES_L from './languages';

// export const PROCEDURES = PROCEDURES_L;
export const JAw_ETHALON = JAw_ETHALON_L;
export const LOCATIONS = LOCATIONS_L;

// Teeth schema locations

export const TEETH_DEFAULT_LOCATIONS = TEETH_DEFAULT_LOCATIONS_L;
export const TEETH_SCHEMA = TEETH_SCHEMA_L;

export const TEETH_ADDULT_BOTTOM = TEETH_ADDULT_BOTTOM_L;
export const TEETH_ADDULT_TOP = TEETH_ADDULT_TOP_L;
export const TEETH_ADDULT_ALL = TEETH_ADDULT_ALL_L;

export const TEETH_BABY_BOTTOM = TEETH_BABY_BOTTOM_L;
export const TEETH_BABY_ALL = TEETH_BABY_ALL_L;
export const TEETH_BABY_TOP = TEETH_BABY_TOP_L;

export const TEETH_ALL = TEETH_ALL_L;

export const TIMEZONES = TIMEZONES_L;

export const COMMON_CURRENCY = COMMON_CURRENCY_L;

// Constants Declaration

// Auth
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_LOCK = 'AUTH_LOCK';
export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_REFRESH_TOKEN = 'AUTH_REFRESH_TOKEN';
export const AUTH_DECODE_TOKEN = 'AUTH_DECODE_TOKEN';
export const AUTH_SET_PROP = 'AUTH_SET_PROP';


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
export const USER_PROP_SET = 'USER_PROP_SET';
export const USER_UPDATE_PASSWORD = 'USER_UPDATE_PASSWORD';
export const USER_SAVE_TO_LOCAL_STORAGE = 'USER_SAVE_TO_LOCAL_STORAGE';
export const USER_REGISTER = 'USER_REGISTER';
export const USER_PATIENTS_COLUMNS = 'USER_PATIENTS_COLUMNS';
export const USER_DIAGNOSIS_COLUMNS = 'USER_DIAGNOSIS_COLUMNS';
export const USER_ANAMNESIS_COLUMNS = 'USER_ANAMNESIS_COLUMNS';
export const USER_PROCEDURES_COLUMNS = 'USER_PROCEDURES_COLUMNS';
export const USER_BILLING_COLUMNS = 'USER_BILLING_COLUMNS';
export const USER_INVOICE_COLUMNS = 'USER_INVOICE_COLUMNS';

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
export const LOADER_SWITCH_OFF = 'LOADER_SWITCH_OFF';
export const LOADER_SWITCH_ON = 'LOADER_SWITCH_ON';
export const JAW_LOADER_START = 'JAW_LOADER_START';
export const JAW_LOADER_STOP = 'JAW_LOADER_STOP';
export const LOADER_SET_PROP = 'LOADER_SET_PROP';

// Patients
export const PATIENTS_REQUEST = 'PATIENTS_REQUEST';
export const PATIENTS_SUCCESS = 'PATIENTS_SUCCESS';
export const PATIENTS_RESET = 'PATIENTS_RESET';
export const PATIENTS_ERROR = 'PATIENTS_ERROR';
export const PATIENTS_SET = 'PATIENTS_SET';
export const PATIENTS_SET_PROP = 'PATIENTS_SET_PROP';
export const PATIENTS_PATIENT_ADD = 'PATIENTS_PATIENT_ADD';

//Last Patient{
    export const  LAST_PATIENT_SET  = 'LAST_PATIENT_SET';
    export const   LAST_PATIENT_UNSET  = 'LAST_PATIENT_UNSET';
    export const    LAST_PATIENT_PARAM_PUSH  = 'LAST_PATIENT_PARAM_PUSH';

// Patient
export const PATIENT_CREATE = 'PATIENT_CREATE';
export const PATIENT_EDIT = 'PATIENT_EDIT';
export const PATIENT_REQUEST = 'PATIENT_REQUEST';
export const PATIENT_SUCCESS = 'PATIENT_SUCCESS';
export const PATIENT_ERROR = 'PATIENT_ERROR';
export const PATIENT_AVATAR_UPLOAD = 'PATIENT_AVATAR_UPLOAD';
export const PATIENT_UPDATE = 'PATIENT_UPDATE';
export const PATIENT_UNSET = 'PATIENT_UNSET';
export const PATIENT_LOGOUT = 'PATIENT_LOGOUT';
export const PATIENT_PLAN_SET = 'PATIENT_PLAN_SET';
export const PATIENT_PLAN_DELETE = 'PATIENT_PLAN_DELETE';
export const PATIENT_PLAN_EDIT = 'PATIENT_PLAN_EDIT';
export const PATIENT_PLAN_SWITCH_CURRENT = 'PATIENT_PLAN_SWITCH_CURRENT';
export const PATIENT_PROCEDURE_SET = 'PATIENT_PROCEDURESS_SET';
export const PATIENT_PROCEDURE_DELETE = 'PATIENT_PROCEDURESS_DELETE';
export const PATIENT_PROCEDURES_ASSOCIATE_WITH_INVOICE = 'PATIENT_PROCEDURES_ASSOCIATE_WITH_INVOICE';
export const PATIENT_TREATMETS_DELETE = 'PATIENT_TREATMETS_DELETE';
export const PATIENT_TREATMETS_UPDATE = 'PATIENT_TREATMETS_UPDATE';
export const PATIENT_PROCEDURE_UPDATE = 'PATIENT_PROCEDURE_UPDATE';
export const PATIENT_ANAMNES_SET = 'PATIENT_ANAMNES_SET';
export const PATIENT_ANAMNES_UPDATE = 'PATIENT_ANAMNES_UPDATE';
export const PATIENT_MANIPULATION_SET = 'PATIENT_MANIPULATION_SET';
export const PATIENT_MANIPULATION_EDIT = 'PATIENT_MANIPULATION_EDIT';
export const PATIENT_DIAGNOSE_SET = 'PATIENT_DIAGNOSE_SET';
export const PATIENT_DIAGNOSE_DELETE = 'PATIENT_DIAGNOSE_DELETE';
export const PATIENT_DIAGNOSE_UPDATE = 'PATIENT_DIAGNOSE_UPDATE';
export const PATIENT_ITEM_VISIBILITY_TOGGLE = 'PATIENT_ITEM_VISIBILITY_TOGGLE';
export const PATIENT_ITEM_JUST_ADDED_TOGGLE = 'PATIENT_ITEM_JUST_ADDED_TOGGLE';
export const PATIENT_GET = 'PATIENT_GET';
export const PATIENT_PARAM_SET = 'PATIENT_PARAM_SET';
export const PATIENT_PARAM_PUSH = 'PATIENT_PARAM_PUSH';
export const PATIENT_PARAM_DELETE = 'PATIENT_PARAM_DELETE';
export const PATIENT_PARAM_REWRITE = 'PATIENT_PARAM_REWRITE';
export const PATIENT_PARAMS_SET = 'PATIENT_PARAMS_SET';
export const PATIENT_NOTE_CREATE = 'PATIENT_NOTE_CREATE';
export const PATIENT_ADD_SUB_PROP = 'PATIENT_ADD_SUB_PROP';
export const PATIENT_FILE_DOWNLOAD = 'PATIENT_FILE_DOWNLOAD';
export const PATIENT_SUB_PARAM_SET = 'PATIENT_SUB_PARAM_SET';
export const PATIENT_SUB_PARAMS_SET = 'PATIENT_SUB_PARAMS_SET';
export const PATIENT_SUB_PARAM_PUSH = 'PATIENT_SUB_PARAM_PUSH';
export const PATIENT_SUB_PARAM_DELETE = 'PATIENT_SUB_PARAM_DELETE';
export const PATIENT_INVOICE_SET = 'PATIENT_INVOICE_SET';
export const PATIENT_PAYMENT_SET = 'PATIENT_PAYMENT_SET';
export const PATIENT_MANIPULATION_DELETE = 'PATIENT_MANIPULATION_DELETE';
export const PATIENT_JAW_UPDATE = 'PATIENT_JAW_UPDATE';

// Clinic
export const CLINIC_AUTH_REQUEST = 'CLINIC_AUTH_REQUEST';
export const CLINIC_REQUEST = 'CLINIC_REQUEST';
export const CLINIC_UPDATE = 'CLINIC_UPDATE';
export const CLINIC_SUCCESS = 'CLINIC_SUCCESS';
export const CLINIC_ERROR = 'CLINIC_ERROR';
export const CLINIC_SET = 'CLINIC_SET';
export const CLINIC_SET_PROPS = 'CLINIC_SET_PROPS';
export const CLINIC_SET_PROP = 'CLINIC_SET_PROP';
export const CLINIC_LOGO_UPLOAD = 'CLINIC_LOGO_UPLOAD';
export const CLINIC_DIAGNOSIS_GET = 'CLINIC_DIAGNOSIS_GET';
export const CLINIC_PROCEDURES_GET = 'CLINIC_PROCEDURES_GET';
export const CLINIC_MANIPULATIONS_GET = 'CLINIC_MANIPULATIONS_GET';
export const CLINIC_MANIPULATIONS_COLUMNS = 'CLINIC_MANIPULATIONS_COLUMNS';
export const CLINIC_PROCEDURES_COLUMNS = 'CLINIC_PROCEDURES_COLUMNS';
export const CLINIC_DIAGNOSIS_COLUMNS = 'CLINIC_DIAGNOSIS_COLUMNS';

export const CLINICS_CREATE = 'CLINICS_CREATE';
export const CLINICS_PROP_SET = 'CLINICS_PROP_SET';
export const CLINICS_PROP_PUSH = 'CLINICS_PROP_SET';

// Diagnosis
export const DIAGNOSIS_REQUEST = 'DIAGNOSIS_REQUEST';
export const DIAGNOSIS_UPDATE = 'DIAGNOSIS_UPDATE';
export const DIAGNOSIS_SUCCESS = 'DIAGNOSIS_SUCCESS';
export const DIAGNOSIS_ERROR = 'DIAGNOSIS_ERROR';
export const DIAGNOSIS_SET = 'DIAGNOSIS_SET';

// Teeth
// export const TEETH_INITIATION = 'TEETH_INITIATION';
export const TEETH_INITIATION_ETHALON = 'TEETH_INITIATION_ETHALON';

// Company
export const COMPANY_NAME = 'Dental CRM';
export const COMPANY_LOGO_URL = 'https://s3.envato.com/files/247286010/owl-logo.png';
export const COMPANY_COLOR = '#43a047';
export const COMPANY_LINK = 'https://dental.owl.team';
export const SIDEBAR_BACKGROUND_URL = 'https://owl.team/sidebar-6.jpg';
export const LOGIN_BACKGROUND_URL = 'https://owl.team/backround-register.jpg';

// Base
export const BASE_URL = 'https://api.zoobapp.com/v1';

// Server errors
export const SERVER_ERRORS = SERVER_ERRORS_L;

// Local storage items
export const LOCAL_STORAGE = LOCAL_STORAGE_L;

// Upload file settings
export const UPLOAD_FILE_SETTINGS = UPLOAD_FILE_SETTINGS_L;

export const AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES_L;
export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

// EventBus Events
export const EB_SHOW_ITEM_WIZARD = 'EB_SHOW_ITEM_WIZARD';
export const EB_SHOW_PATIENT_PRINT_FORM = 'EB_SHOW_PATIENT_PRINT_FORM';

// Store keys
export const STORE_KEY_PATIENT = '$_patient';
export const STORE_KEY_REGISTRATION = '$_registration';
export const STORE_KEY_PATIENTS = '$_patients';


