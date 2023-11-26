import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import { Link, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEditionById } from "../../../data/back-api/back-api";

export default function EditionIdPage() {
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());

  useEffect(() => {
    if (!editionId || isNaN(editionId)) return;

    getEditionById(editionId).then((p) => setEdition(p));
  }, [editionId]);

  if (edition.id <= 0) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Title>{`Rôles du module '${edition.name}'`}</Title>
      <Spacer y={3} />
      <Container>
        {edition.roles.map((r) => (
          <Link key={r.id} href={`/roles/${r.id}`}>
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
