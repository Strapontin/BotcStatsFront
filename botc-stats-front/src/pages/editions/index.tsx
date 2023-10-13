import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { getAllEditions } from "../../../data/back-api/back-api";

export default function EditionsPage({ editions }: { editions: Edition[] }) {
  const [filter, setFilter] = useState<string>("");
  const title = "Liste des modules";

  if (editions.length === 0) {
    return (
      <>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Title>{title}</Title>
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre module"
      ></Filter>
      <Container>
        {editions
          .filter((edition) =>
            toLowerRemoveDiacritics(edition.name).includes(
              toLowerRemoveDiacritics(filter)
            )
          )
          .map((edition) => (
            <Link
              key={edition.id}
              href={`/editions/${edition.id}`}
              color="text"
            >
              <ListItem name={edition.name} />
            </Link>
          ))}
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const editions = await getAllEditions();

  return {
    props: {
      editions,
    },
    revalidate: 3,
  };
}
