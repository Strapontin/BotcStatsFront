import { Edition } from "@/entities/Edition";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import { getEditionById } from "../../../data/back-api/back-api";
import { useRouter } from "next/router";
import Title from "@/components/ui/title";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Container from "@/components/list-stats/Container";

export default function EditionIdPage() {
  const editionId: number = Number(useRouter().query.editionId);
  const [edition, setEdition] = useState<Edition>();
  var title = "Rôles du module...";

  useEffect(() => {
    async function initEditions() {
      const e = await getEditionById(editionId);
      setEdition(e);
    }
    initEditions();
  }, [editionId]);

  if (edition === undefined) {
    return (
      <Fragment>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Loading />
      </Fragment>
    );
  }
  title = `Rôles du module '${edition.name}'`;

  return (
    <Fragment>
      <Title>{title}</Title>
      <Spacer y={3} />
      <Container>
        {edition.roles.map((r) => (
          <Link key={r.id} href={`/roles/${r.id}`} color="text">
            <ListItemRole
              key={r.id}
              image={r.name}
              characterType={r.characterType}
            ></ListItemRole>
          </Link>
        ))}
      </Container>
    </Fragment>
  );
}
