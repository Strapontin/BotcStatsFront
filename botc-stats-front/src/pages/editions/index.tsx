import { Fragment, useEffect, useState } from "react";
import { Edition } from "@/entities/Edition";
import Container from "@/components/list-stats/Container";
import Title from "@/components/ui/title";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { getAllEditions } from "../../../data/back-api/back-api";
import ListItem from "@/components/list-stats/ListItem";

export default function EditionsPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const title = "Liste des modules";

  useEffect(() => {
    async function initEditions() {
      const r = await getAllEditions();
      setEditions(r);
    }
    initEditions();
  }, []);

  if (editions.length === 0) {
    return (
      <Fragment>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Loading />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Title>{title}</Title>
      <Container>
        {editions.map((edition) => (
          <Link key={edition.id} href={`/editions/${edition.id}`} color="text">
            <ListItem name={edition.name} />
          </Link>
        ))}
      </Container>
    </Fragment>
  );
}
