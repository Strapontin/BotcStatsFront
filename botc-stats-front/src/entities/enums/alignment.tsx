export enum Alignment {
  None = -1,
  Good = 0,
  Evil = 1,
}

export function alignmentToString(alignment: Alignment) {
  return alignment === Alignment.Good ? "Gentil" : "Maléfique";
}

export function alignmentList(): { key: number; value: string }[] {
  const alignments = Object.values(Alignment)
    .filter((ct) => typeof ct !== "number" && ct !== Alignment[Alignment.None])
    .map((key: any) => ({
      key: +Alignment[key],
      value: translate(key),
    }));

  return alignments;
}

export function getAlignmentTextById(
  id: number,
  defaultValue: string = ""
): string {
  const result = alignmentList()[id];
  if (result === undefined) {
    return defaultValue;
  }
  return result.value;
}

function translate(name: string) {
  return name === "Good" ? "Gentil" : name === "Evil" ? "Maléfique" : "";
}
