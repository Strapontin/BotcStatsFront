import { Edition } from "@/entities/Edition";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutocompleteEdition({
  editions,
  selectedEdition,
  setSelectedEdition,
}: {
  editions: Edition[];
  selectedEdition: Edition;
  setSelectedEdition: (edition: Edition) => void;
}) {
  return (
    <Autocomplete
      label={"Module"}
      variant="bordered"
      placeholder="Sélectionner un module"
      onSelectionChange={(editionId) => {
        setSelectedEdition(editions.find((e) => e.id === +editionId)!);
      }}
      scrollShadowProps={{
        visibility: "none",
      }}
    >
      {editions.map((edition) => {
        return (
          <AutocompleteItem key={edition.id}>{edition.name}</AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
