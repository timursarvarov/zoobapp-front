export default function toggleAllLocations(location, diagnose, toothId) {
  if (!location || !diagnose || !toothId) {
    return diagnose;
  }
  const d = diagnose;
  if (d.teeth[toothId][location] !== undefined) {
    d.teeth[toothId] = {};
  } else {
    Object.keys(diagnose.locations).forEach((locationKey) => {
      d.teeth[toothId][locationKey] = diagnose.locations[locationKey];
    });
  }
  return d;
}
