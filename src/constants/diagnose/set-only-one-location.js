export default function toggleLocation(location, diagnose, toothId) {
    if (!location || !diagnose || !toothId) {
        return diagnose;
    }
    const d = diagnose;
        Object.keys(diagnose.locations).forEach((element) => {
            if (Object.keys(d.teeth[toothId]).find(key => key === element) && location !== element) {
                delete d.teeth[toothId][element];
            }
        });
        if (d.teeth[toothId][location]) {
            delete d.teeth[toothId][location];
        } else {
            d.teeth[toothId][location] = true;
        }
        return d;
    }
