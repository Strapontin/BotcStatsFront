import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { Link, Spacer } from "@nextui-org/react";
import { getEditionById } from "../../../data/back-api/back-api";

export default function EditionIdPage({
  editionLoaded,
}: {
  editionLoaded: Edition;
}) {
  const title = `Rôles du module '${editionLoaded.name}'`;

  return (
    <>
      <Title>{title}</Title>
      <Spacer y={3} />
      <Container>
        {editionLoaded.roles.map((r) => (
          <Link key={r.id} href={`/roles/${r.id}`} color="text">
            <ListItemRole
              key={r.id}
              image={r.name}
              characterType={r.characterType}
            ></ListItemRole>
          </Link>
        ))}
      </Container>
    </>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { editionId: number };
}) {
  const editionLoaded = await getEditionById(params.editionId);

  if (!editionLoaded || editionLoaded.status === 404) {
    return { notFound: true };
  }

  return {
    props: {
      editionLoaded,
    },
    revalidate: 5,
  };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
