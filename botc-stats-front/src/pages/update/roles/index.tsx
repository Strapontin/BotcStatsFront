import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { Fragment, useState } from "react";
import { getAllRoles } from "../../../../data/back-api/back-api";

export default function UpdateRolesPage({ roles }: { roles: Role[] }) {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Modifier un rôle</Title>;

  if (roles.length === 0) {
    return (
      <Fragment>
        {title}
        <Spacer y={3} />
        <Loading />
      </Fragment>
    );
  }

  function line(role: Role) {
    return (
      <Link key={role.id} href={`/update/roles/${role.id}`} color="text">
        <ListItemRole
          image={role.name}
          characterType={role.characterType}
        ></ListItemRole>
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
        placeholder="Filtre rôle"
      ></Filter>
      <Container>
        {roles
          .filter((role) =>
            toLowerRemoveDiacritics(role.name).includes(
              toLowerRemoveDiacritics(filter)
            )
          )
          .map((role: Role) => line(role))}
      </Container>
    </Fragment>
  );
}

export async function getStaticProps() {
  const roles = await getAllRoles();

  return {
    props: {
      roles,
    },
    revalidate: 10,
  };
}
