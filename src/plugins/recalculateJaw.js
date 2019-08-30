// const jawEthalon = store.getters.jawEthalon;
// const patientItems = {
//     procedures: store.getters.getPatientCurrentPlanProcedures,
//     diagnosis: store.getters.getCurrentClinicDiagnosis,
//     ananmnesis: store.getters.getCurrentAnanmnesis,
// };
// const calcJaw = JSON.parse(JSON.stringify(jawEthalon));

/** localType - avaolable procedures, diagnoses , anamneses*/
/** jawEthalon - эталон начального отображения локаций зубов */

export default function recalculateJaw(jawEthalon, patientItems) {
    const calcJaw = JSON.parse(JSON.stringify(jawEthalon));
    Object.keys(patientItems).forEach(itemType => {
        patientItems[itemType].forEach(item => {
            if (true || item.showInJaw) {
                Object.keys(item.teeth).forEach((toothId) => {
                    Object.keys(item.teeth[toothId]).forEach(kLocation => {
                        if (kLocation in calcJaw[itemType][toothId]) {
                            if (!item.teeth[toothId][kLocation]) {
                                calcJaw[itemType][toothId][kLocation] = item.teeth[toothId][kLocation];
                            }
                        } else {
                            calcJaw[itemType][toothId][kLocation] = item.teeth[toothId][kLocation];
                        }
                    }, );
                });
            }
        });
    });
    return calcJaw;
};