import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllRoles } from "../../../../data/back-api/back-api";

export default function UpdateRolesPage() {
  const [filter, setFilter] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const title = <Title>Modifier un rôle</Title>;

  useEffect(() => {
    getAllRoles().then((r) => {
      setRoles(r);
    });
  }, []);
  
  if (roles.length === 0) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Loading />
      </>
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
    <>
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
    </>
  );
}
