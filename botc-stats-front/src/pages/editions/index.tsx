import Filter from "@/components/filter/Filter";
import Title from "@/components/ui/title";
import { useGetEditions } from "@/data/back-api/back-api-edition";
import { Edition } from "@/entities/Edition";
import { stringContainsString } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function EditionsPage() {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Liste des modules</Title>;

  const { data: editions, isLoading } = useGetEditions();

  if (isLoading) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const filteredEditions = editions.filter((edition: Edition) =>
    stringContainsString(edition.name, filter)
  );

  return (
    <>
      {title}
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre module"
      />
      <Listbox aria-label="Modules">
        {filteredEditions.map((edition: Edition) => (
          <ListboxItem
            showDivider
            key={edition.id}
            href={`/editions/${edition.id}`}
          >
            {edition.name}
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
