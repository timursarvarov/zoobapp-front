/** localType - avaolable procedures, diagnoses , anamneses*/
/** JAw_ETHALON - эталон начального отображения локаций зубов */
import { JAw_ETHALON } from '@/constants';
import { cloneDeep } from 'lodash';

export default function recalculateJaw(patientItems) {
    const calcJaw = cloneDeep(JAw_ETHALON);
    Object.keys(patientItems).forEach(itemType => {
        patientItems[itemType].forEach(item => {
            //! переделать после реализации в беке
            // eslint-disable-next-line no-constant-condition
            if (true || (item.showInJaw && item.teeth)) {
                Object.keys(item.teeth).forEach(toothId => {
                    Object.keys(item.teeth[toothId]).forEach(kLocation => {
                        if (kLocation in calcJaw[itemType][toothId]) {
                            if (!item.teeth[toothId][kLocation]) {
                                calcJaw[itemType][toothId][kLocation] = item.teeth[toothId][kLocation];
                            }
                        } else {
                            calcJaw[itemType][toothId][kLocation] = item.teeth[toothId][kLocation];
                        }
                    });
                });
            }
        });
    });
    return calcJaw;
}
