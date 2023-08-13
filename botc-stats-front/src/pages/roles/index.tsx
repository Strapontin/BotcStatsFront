import { Fragment, useEffect, useState } from "react";
import { Role } from "@/entities/Role";
import Container from "@/components/list-stats/Container";
import Title from "@/components/ui/title";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { getAllRoles } from "../../../data/back-api/back-api";
import ListItemRole from "@/components/list-stats/ListItemRole";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const title = "Liste des rôles";

  useEffect(() => {
    async function initRoles() {
      const r = await getAllRoles();
      setRoles(r);
    }
    initRoles();
  }, []);

  if (roles.length === 0) {
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
        {roles.map((role) => (
          <Link key={role.id} href={`/roles/${role.id}`} color="text">
            <ListItemRole
              image={role.name}
              characterType={role.characterType}
            />
          </Link>
        ))}
      </Container>
    </Fragment>
  );
}
