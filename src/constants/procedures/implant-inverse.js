/* eslint-disable no-tabs */
export default function implantInverse(location, procedure, originalProcedure, toothId) {
	if (!location || !procedure || !originalProcedure || !toothId) {
		return procedure;
	}
	const d = procedure;

	if (Object.keys(d.teeth[toothId]).length === 0) {
		Object.keys(originalProcedure.locations[location]).forEach((loc) => {
			d.teeth[toothId][loc] = originalProcedure.locations[loc];
		});
	} else if (location === 'coronaLingual' || location === 'coronaTop' || location === 'coronaLabial') {
			if (Object.keys(d.teeth[toothId]).includes(location)) {
				delete d.teeth[toothId].coronaLingual;
				delete d.teeth[toothId].coronaTop;
				delete d.teeth[toothId].coronaLabial;
			} else {
				d.teeth[toothId].coronaLingual = originalProcedure.locations.coronaLingual;
				d.teeth[toothId].coronaTop = originalProcedure.locations.coronaTop;
				d.teeth[toothId].coronaLabial = originalProcedure.locations.coronaLabial;
			}
		} else if (location === 'implant') {
			if (Object.keys(d.teeth[toothId]).includes(location)) {
				delete d.teeth[toothId];
			} else {
				d.teeth[toothId].implant = originalProcedure.locations.implant;
			}
		}
	return d;
}
