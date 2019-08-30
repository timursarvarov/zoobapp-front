export default function toggleLocation(location, diagnose, originalDiagnose, toothId) {
    if (!location || !diagnose || !originalDiagnose || !toothId) {
        return diagnose;
    }
    const d = diagnose;
    Object.keys(originalDiagnose.locations).forEach((element) => {
        if (
            Object.keys(d.teeth[toothId]).find(key => key === element)
      && location !== element
        ) {
            delete d.teeth[toothId][element];
        }
    });
    if (d.teeth[toothId][location] !== undefined) {
        delete d.teeth[toothId][location];
    } else {
        d.teeth[toothId][location] = originalDiagnose.locations[location];
    }
    return d;
}
