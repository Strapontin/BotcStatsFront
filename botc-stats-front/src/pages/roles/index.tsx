import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { getAllRoles } from "../../../data/back-api/back-api";

export default function RolesPage({ roles }: { roles: Role[] }) {
  const [filter, setFilter] = useState<string>("");
  const title = "Liste des rôles";

  if (roles.length === 0) {
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
        placeholder="Filtre rôle"
      ></Filter>
      <Container>
        {roles
          .filter((edition) =>
            toLowerRemoveDiacritics(edition.name).includes(
              toLowerRemoveDiacritics(filter)
            )
          )
          .map((role) => (
            <Link key={role.id} href={`/roles/${role.id}`} color="text">
              <ListItemRole
                image={role.name}
                characterType={role.characterType}
              />
            </Link>
          ))}
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const roles = await getAllRoles();

  return {
    props: {
      roles,
    },
  };
}
