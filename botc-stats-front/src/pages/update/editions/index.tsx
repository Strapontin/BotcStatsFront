import Filter from "@/components/filter/Filter";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllEditions } from "../../../../data/back-api/back-api";

export default function UpdateEditionsPage() {
  const [filter, setFilter] = useState<string>("");
  const [editions, setEditions] = useState<Edition[]>([]);
  const title = <Title>Modifier un module</Title>;

  useEffect(() => {
    getAllEditions().then((r) => {
      setEditions(r);
    });
  }, []);

  if (editions.length === 0) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  function line(edition: Edition) {
    return (
      <Link key={edition.id} href={`/update/editions/${edition.id}`}>
        <ListItem left={edition.name}></ListItem>
      </Link>
    );
  }

  const editionsFiltered = editions.filter((edition) =>
    toLowerRemoveDiacritics(edition.name).includes(
      toLowerRemoveDiacritics(filter)
    )
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
      <Spacer y={5} />
      <Listbox aria-label="Parties jouées">
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
