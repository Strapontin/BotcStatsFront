import { Edition } from "@/entities/Edition";
import { stringContainsString, toLowerRemoveDiacritics } from "@/helper/string";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/react";
import { useState } from "react";

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
  const [showDivider, setShowDivider] = useState(true);
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

  let otherEditions = editionsSorted.filter(
    (e) => !officialEditionNames.includes(e.name)
  );

  return (
    <Autocomplete
      label={autocompleteLabel}
      variant="bordered"
      placeholder={autocompletePlaceholder}
      onSelectionChange={(editionId) => {
        setSelectedEdition(editions.find((e) => e.id === +editionId)!);
      }}
      onInputChange={(text) => {
        setShowDivider(
          otherEditions.some((e) => stringContainsString(e.name, text))
        );
      }}
      isLoading={isLoading}
      defaultSelectedKey={defaultSelectedKey}
    >
      <AutocompleteSection
        showDivider={showDivider}
        title="Modules officiels"
      >
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
        {otherEditions.map((edition) => {
          return (
            <AutocompleteItem key={edition.id}>{edition.name}</AutocompleteItem>
          );
        })}
      </AutocompleteSection>
    </Autocomplete>
  );
}
