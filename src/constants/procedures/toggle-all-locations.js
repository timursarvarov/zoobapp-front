export default function toggleAllLocations(location, procedure, originalProcedure, toothId) {
  if (!location || !procedure || !originalProcedure || !toothId) {
    return procedure;
  }
  const d = procedure;
  if (d.teeth[toothId][location] !== undefined) {
    d.teeth[toothId] = {};
  } else {
    Object.keys(originalProcedure.locations).forEach((locationKey) => {
      d.teeth[toothId][locationKey] = originalProcedure.locations[locationKey];
    });
  }
  return d;
}
