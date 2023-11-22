import Filter from "@/components/filter/Filter";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllEditions } from "../../../data/back-api/back-api";

export default function EditionsPage() {
  const [filter, setFilter] = useState<string>("");
  const [editions, setEditions] = useState<Edition[]>([]);
  const title = "Liste des modules";

  useEffect(() => {
    getAllEditions().then((r) => {
      setEditions(r);
    });
  }, []);

  if (editions.length === 0) {
    return (
      <>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const filteredEditions = editions.filter((edition) =>
    toLowerRemoveDiacritics(edition.name).includes(
      toLowerRemoveDiacritics(filter)
    )
  );

  return (
    <>
      <Title>{title}</Title>
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre module"
      />
      <Listbox aria-label="Modules">
        {filteredEditions.map((edition) => (
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
