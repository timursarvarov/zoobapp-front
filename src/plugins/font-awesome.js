import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faFileCsv,
    faFileInvoice,
    faFileMedical,
    faFilePrescription,
} from '@fortawesome/free-solid-svg-icons';
import {
    faFile,
    faFileAlt,
    faFileArchive,
    faFileAudio,
    faFileCode,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFilePowerpoint,
    faFileVideo,
    faFileWord,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
    faFileCsv,
    faFileInvoice,
    faFileMedical,
    faFilePrescription,
    faFile,
    faFileCode,
    faFileAlt,
    faFileArchive,
    faFileAudio,
    faFileCode,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFilePowerpoint,
    faFileVideo,
    faFileWord,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = true;
