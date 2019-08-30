export default function hideLocation(location, diagnose, originalDiagnose, toothId) {
    console.log(location, diagnose, toothId);
    if (!location || !originalDiagnose || !diagnose || !toothId) {
        return diagnose;
    }
    const d = diagnose;
    if (d.teeth[toothId][location]) {
        delete d.teeth[toothId][location];
    } else {
        d.teeth[toothId][location] = originalDiagnose[location];
    }
    return d;
}
