export default function toggleLocation(location, diagnose, toothId) {
  if (!location || !diagnose || !toothId) {
    return diagnose;
  }
  const d = diagnose;
  if (d.teeth[toothId][location]) {
    delete d.teeth[toothId][location];
  } else {
    d.teeth[toothId][location] = diagnose.locations[location];
  }
  return d;
}
