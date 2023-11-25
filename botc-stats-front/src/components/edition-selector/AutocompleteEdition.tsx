import { Edition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutocompleteEdition({
  editions,
  isLoading,
  setSelectedEdition,
  autocompleteLabel,
  autocompletePlaceholder,
}: {
  editions: Edition[];
  isLoading?: boolean;
  setSelectedEdition: (edition: Edition) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
}) {
  const editionsSorted = isLoading
    ? []
    : editions.sort((a, b) =>
        toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
          ? -1
          : 1
      );

  return (
    <Autocomplete
      label={autocompleteLabel}
      variant="bordered"
      placeholder={autocompletePlaceholder}
      onSelectionChange={(editionId) => {
        setSelectedEdition(editions.find((e) => e.id === +editionId)!);
      }}
      isLoading={isLoading}
    >
      {editionsSorted.map((edition) => {
        return (
          <AutocompleteItem key={edition.id}>{edition.name}</AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
