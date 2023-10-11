import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import {
  getAllEditions,
  getEditionById,
} from "../../../data/back-api/back-api";

export default function EditionIdPage({
  editionLoaded,
}: {
  editionLoaded: Edition;
}) {
  const editionId: number = Number(useRouter().query.editionId);
  const [edition, setEdition] = useState<Edition>(editionLoaded);
  var title = "Rôles du module...";

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

export async function getStaticProps({
  params,
}: {
  params: { editionId: number };
}) {
  const { editionId } = params;
  const editionLoaded = await getEditionById(editionId);

  return {
    props: {
      editionLoaded,
    },
    revalidate: 10,
  };
}

export const getStaticPaths = async () => {
  const editions = await getAllEditions();

  const paths = editions.map((edition) => ({
    params: { editionId: edition.id.toString() },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
};
