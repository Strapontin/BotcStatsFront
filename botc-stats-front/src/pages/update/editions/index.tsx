import { Fragment, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import { getAllEditions } from "../../../../data/back-api/back-api";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import Container from "@/components/list-stats/Container";
import { Edition } from "@/entities/Edition";
import ListItem from "@/components/list-stats/ListItem";
import Filter from "@/components/filter/Filter";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function UpdateEditionsPage({
  editions,
}: {
  editions: Edition[];
}) {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Modifier un module</Title>;

  if (editions.length === 0) {
    return (
      <Fragment>
        {title}
        <Spacer y={3} />
        <Loading />
      </Fragment>
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
    <Fragment>
      {title}
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
          .map((edition: Edition) => line(edition))}
      </Container>
    </Fragment>
  );
}

export async function getStaticProps() {
  const editions = await getAllEditions();

  return {
    props: {
      editions,
    },
    revalidate: 10,
  };
}
