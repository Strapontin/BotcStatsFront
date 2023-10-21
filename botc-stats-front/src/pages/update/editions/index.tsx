import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
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
        <Loading />
      </>
    );
  }

  function line(edition: Edition) {
    return (
      <Link
        key={edition.id}
        href={`/update/editions/${edition.id}`}
        color="text"
      >
        <ListItem name={edition.name}></ListItem>
      </Link>
    );
  }

  return (
    <>
      {title}
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre module"
      />
      <Container>
        {editions
          .filter((edition) =>
            toLowerRemoveDiacritics(edition.name).includes(
              toLowerRemoveDiacritics(filter)
            )
          )
          .map((edition: Edition) => line(edition))}
      </Container>
    </>
  );
}
