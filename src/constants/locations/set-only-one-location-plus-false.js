export default function setOnlyOneLocationPlusFalse(location, diagnose, originalDiagnose, toothId) {
  if (!location || !diagnose || !toothId || !originalDiagnose) {
    return diagnose;
  }
  const d = diagnose;
  // удаляю все локации
  Object.keys(originalDiagnose.locations).forEach((element) => {
    if (
      Object.keys(d.teeth[toothId]).find(key => key === element)
      && location !== element
    ) {
      delete d.teeth[toothId][element];
    }
  });

  if (d.teeth[toothId][location] !== undefined) {
    delete d.teeth[toothId][location];
  } else {
    d.teeth[toothId][location] = originalDiagnose.locations[location];
  }
  Object.keys(originalDiagnose.locations).forEach((locationKey) => {
    if (originalDiagnose.locations[locationKey] === false) {
      console.log(d.teeth[toothId]);
      if (Object.keys(d.teeth[toothId]).length === 1) {
        d.teeth[toothId][locationKey] = false;
      }
    }
  });
  console.log(d.teeth[toothId]);

  return d;
}
