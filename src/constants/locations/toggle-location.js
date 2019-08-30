export default function toggleLocation(location, diagnose, originalDiagnose, toothId) {
    if (!location || !diagnose || !originalDiagnose || !toothId) {
        return diagnose;
    }
    const d = diagnose;
    if (location in d.teeth[toothId]) {
        delete d.teeth[toothId][location];
    } else {
        d.teeth[toothId][location] = originalDiagnose.locations[location];
    }
    return d;
}
