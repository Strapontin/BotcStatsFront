import { Fragment, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import { getAllRoles } from "../../../../data/back-api/back-api";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import Container from "@/components/list-stats/Container";
import { Role } from "@/entities/Role";
import ListItem from "@/components/list-stats/ListItem";
import ListItemRole from "@/components/list-stats/ListItemRole";

export default function UpdateRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const title = <Title>Modifier un rôle</Title>;

  useEffect(() => {
    async function initRoles() {
      const tempRoles = await getAllRoles();
      setRoles(tempRoles);
    }
    initRoles();
  }, []);

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
      <Container>{roles.map((role: Role) => line(role))}</Container>
    </Fragment>
  );
}
