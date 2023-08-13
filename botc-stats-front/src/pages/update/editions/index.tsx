import { Fragment, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import { getAllEditions } from "../../../../data/back-api/back-api";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import Container from "@/components/list-stats/Container";
import { Edition } from "@/entities/Edition";
import ListItem from "@/components/list-stats/ListItem";

export default function UpdateEditionsPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const title = <Title>Modifier un module</Title>;

  useEffect(() => {
    async function initEditions() {
      const tempEditions = await getAllEditions();
      setEditions(tempEditions);
    }
    initEditions();
  }, []);

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
      <Link key={edition.id} href={`/update/editions/${edition.id}`} color="text">
        <ListItem name={edition.name}></ListItem>
      </Link>
    );
  }

  return (
    <Fragment>
      {title}
      <Container>{editions.map((edition: Edition) => line(edition))}</Container>
    </Fragment>
  );
}
