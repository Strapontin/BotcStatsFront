export function removeDiacritics(string: string): string {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function toLowerRemoveDiacritics(string: string): string {
  const result = removeDiacritics(string).toLowerCase().trim();

  return result;
}

export function stringsAreEqual(s1: string, s2: string): boolean {
  return (
    toLowerRemoveDiacritics(s1) === toLowerRemoveDiacritics(s2) &&
    toLowerRemoveDiacritics(s1) === toLowerRemoveDiacritics(s2)
  );
}
