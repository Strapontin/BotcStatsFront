import { Edition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/react";

export default function AutocompleteEdition({
  editions,
  isLoading,
  setSelectedEdition,
  autocompleteLabel,
  autocompletePlaceholder,
  defaultSelectedKey,
}: {
  editions: Edition[];
  isLoading?: boolean;
  setSelectedEdition: (edition: Edition) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
  defaultSelectedKey?: string;
}) {
  const editionsSorted = isLoading
    ? []
    : editions.sort((a, b) =>
        toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
          ? -1
          : 1
      );

  const officialEditionNames = [
    "Trouble Brewing",
    "Sects And Violets",
    "Bad Moon Rising",
  ];

  return (
    <Autocomplete
      label={autocompleteLabel}
      variant="bordered"
      placeholder={autocompletePlaceholder}
      onSelectionChange={(editionId) => {
        setSelectedEdition(editions.find((e) => e.id === +editionId)!);
      }}
      isLoading={isLoading}
      defaultSelectedKey={defaultSelectedKey}
    >
      <AutocompleteSection showDivider title="Modules officiels">
        {editionsSorted
          .filter((e) => officialEditionNames.includes(e.name))
          .map((edition) => {
            return (
              <AutocompleteItem key={edition.id}>
                {edition.name}
              </AutocompleteItem>
            );
          })}
      </AutocompleteSection>
      <AutocompleteSection title="Autres modules">
        {editionsSorted
          .filter((e) => !officialEditionNames.includes(e.name))
          .map((edition) => {
            return (
              <AutocompleteItem key={edition.id}>
                {edition.name}
              </AutocompleteItem>
            );
          })}
      </AutocompleteSection>
    </Autocomplete>
  );
}
