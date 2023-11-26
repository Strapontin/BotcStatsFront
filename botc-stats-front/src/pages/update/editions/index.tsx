import Filter from "@/components/filter/Filter";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { useGetEditions } from "@/data/back-api/back-api-edition";
import { Edition } from "@/entities/Edition";
import { stringContainsString, toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function UpdateEditionsPage() {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Modifier un module</Title>;

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

  const editionsFiltered = editions.filter((edition: Edition) =>
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
        {editionsFiltered.map((edition: Edition) => (
          <ListboxItem
            key={edition.id}
            className="text-left"
            href={`/update/editions/${edition.id}`}
            textValue={String(edition.id)}
            showDivider
          >
            {edition.name}
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
