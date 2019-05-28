/* eslint-disable no-tabs */
export default function implantInverse(location, procedure, originalProcedure, toothId) {
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
            if (location === 'crown') {
                d.teeth[toothId].crown = originalProcedure.locations.crown;
                d.teeth[toothId].implant = originalProcedure.locations.implant;
            } else if (location === 'implant') {
                d.teeth[toothId].implant = originalProcedure.locations.implant;
            }
        }
    } else if (originalProcedure.locations[location] === true) {
        if (Object.keys(d.teeth[toothId]).includes(location)) {
            Object.keys(originalProcedure.locations).forEach((loc) => {
                if (originalProcedure.locations[loc] === false) {
                    d.teeth[toothId][loc] = originalProcedure.locations[loc];
                }
            });
            if (location === 'crown') {
                delete d.teeth[toothId].crown;
            } else if (location === 'implant') {
                delete d.teeth[toothId];
            }
        } else if (location === 'crown') {
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