import { Edition } from "@/entities/Edition";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutocompleteEdition({
  editions,
  isLoading,
  setSelectedEdition,
}: {
  editions: Edition[];
  setSelectedEdition: (edition: Edition) => void;
  isLoading?: boolean;
}) {
  return (
    <Autocomplete
      label={"Module"}
      variant="bordered"
      placeholder="Sélectionner un module"
      onSelectionChange={(editionId) => {
        setSelectedEdition(editions.find((e) => e.id === +editionId)!);
      }}
      isLoading={isLoading}
    >
      {editions.map((edition) => {
        return (
          <AutocompleteItem key={edition.id}>{edition.name}</AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
