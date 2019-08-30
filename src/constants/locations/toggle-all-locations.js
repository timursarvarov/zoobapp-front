export default function toggleAllLocations(location, diagnose, originalDiagnose, toothId) {
    if (!location || !diagnose || !originalDiagnose || !toothId) {
        return diagnose;
    }
    const d = diagnose;
    if (d.teeth[toothId][location] !== undefined) {
        d.teeth[toothId] = {};
    } else {
        Object.keys(originalDiagnose.locations).forEach((locationKey) => {
            d.teeth[toothId][locationKey] = originalDiagnose.locations[locationKey];
        });
    }
    return d;
}
