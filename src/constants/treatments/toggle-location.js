export default function toggleLocation(location, treatment, originalTreatment, toothId) {
  if (!location || !treatment || !originalTreatment || !toothId) {
    return treatment;
  }
  const d = treatment;
  if (location in d.teeth[toothId]) {
    delete d.teeth[toothId][location];
  } else {
    d.teeth[toothId][location] = originalTreatment.locations[location];
  }
  return d;
}
