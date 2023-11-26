export function removeDiacritics(string: string): string {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // return string.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function toLowerRemoveDiacritics(string: string): string {
  const result = removeDiacritics(string)
    // .normalize("NFD")
    // .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

  return result;
}
