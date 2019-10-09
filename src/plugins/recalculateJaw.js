/** localType - avaolable procedures, diagnoses , anamneses*/
/** jawEthalon - эталон начального отображения локаций зубов */

export default function recalculateJaw(jawEthalon, patientItems) {
    const calcJaw = JSON.parse(JSON.stringify(jawEthalon));
    Object.keys(patientItems).forEach(itemType => {
        patientItems[itemType].forEach(item => {
            if(!item){
                console.log('noItem')
            }
            if(!itemType){
                console.log('noitemType')
            }
            if(!jawEthalon){
                console.log('nojawEthalon')
            }
            if(!patientItems){
                console.log('nopatientItems')
            }
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
