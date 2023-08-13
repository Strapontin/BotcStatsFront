export enum CharacterType {
  None = -1,
  Townsfolk = 0,
  Outsider = 1,
  Minion = 2,
  Demon = 3,
  Traveller = 4,
  Fabled = 5,
}

export function characterTypeList(): { key: number; value: string }[] {
  const characterTypes = Object.values(CharacterType)
    .filter(
      (ct) => typeof ct !== "number" && ct !== CharacterType[CharacterType.None]
    )
    .map((key: any) => ({
      key: +CharacterType[key],
      value: translate(key),
    }));

  return characterTypes;
}

export function getCharacterTypeTextById(
  id: number,
  defaultValue: string = ""
): string {
  const result = characterTypeList()[id];
  if (result === undefined) {
    return defaultValue;
  }
  return result.value;
}

function translate(name: string): string {
  return name === "Townsfolk"
    ? "Villageois"
    : name === "Outsider"
    ? "Etranger"
    : name === "Minion"
    ? "Sbire"
    : name === "Demon"
    ? "Démon"
    : name === "Traveller"
    ? "Voyageur"
    : name === "Fabled"
    ? "Légendaire"
    : "";
}
