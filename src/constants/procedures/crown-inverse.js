/* eslint-disable no-tabs */
export default function crownInverse(location, procedure, originalProcedure, toothId) {
    if (!location || !procedure || !originalProcedure || !toothId) {
        return procedure;
    }
    const d = procedure;

    if (Object.keys(d.teeth[toothId]).length === 0) {
        if (originalProcedure.locations[location] === true) {
            Object.keys(originalProcedure.locations).forEach((loc) => {
                if (originalProcedure.locations[loc] === false) {
                    d.teeth[toothId][loc] = originalProcedure.locations[loc];
                }
            });
            if (location === 'bridge') {
                d.teeth[toothId].bridge = originalProcedure.locations.bridge;
                d.teeth[toothId].crown = originalProcedure.locations.crown;
            } else if (location === 'crown') {
                d.teeth[toothId].crown = originalProcedure.locations.crown;
            }
        }
    } else if (originalProcedure.locations[location] === true) {
        if (Object.keys(d.teeth[toothId]).includes(location)) {
            Object.keys(originalProcedure.locations).forEach((loc) => {
                if (originalProcedure.locations[loc] === false) {
                    d.teeth[toothId][loc] = originalProcedure.locations[loc];
                }
            });
            if (location === 'bridge') {
                delete d.teeth[toothId].bridge;
            } else if (location === 'crown') {
                delete d.teeth[toothId];
            }
        } else if (location === 'bridge') {
            d.teeth[toothId][location] = originalProcedure.locations[location];
            Object.keys(originalProcedure.locations).forEach((loc) => {
                if (originalProcedure.locations[loc] === false) {
                    d.teeth[toothId][loc] = originalProcedure.locations[loc];
                }
            });
        }
    }
    return d;
}
