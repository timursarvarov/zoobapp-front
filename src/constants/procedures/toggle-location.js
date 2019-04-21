export default function toggleLocation(location, procedure, originalProcedure, toothId) {
  if (!location || !procedure || !originalProcedure || !toothId) {
    return procedure;
  }
  const d = procedure;
  if (location in d.teeth[toothId]) {
    delete d.teeth[toothId][location];
  } else {
    d.teeth[toothId][location] = originalProcedure.locations[location];
  }
  return d;
}
