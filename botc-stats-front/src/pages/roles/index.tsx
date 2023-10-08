import { Fragment, useEffect, useState } from "react";
import { Role } from "@/entities/Role";
import Container from "@/components/list-stats/Container";
import Title from "@/components/ui/title";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { getAllRoles } from "../../../data/back-api/back-api";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Filter from "@/components/filter/Filter";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filter, setFilter] = useState<string>("");
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
    </Fragment>
  );
}
