import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItemRole from "@/components/list-stats/ListItemRole";
import Title from "@/components/ui/title";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Spinner, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllRoles } from "../../../data/back-api/back-api";

export default function RolesPage() {
  const [filter, setFilter] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const title = <Title>Liste des rôles</Title>;

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
        <Spinner />
      </>
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
      />
      <Container>
        {roles
          .filter((edition) =>
            toLowerRemoveDiacritics(edition.name).includes(
              toLowerRemoveDiacritics(filter)
            )
          )
          .map((role) => (
            <Link key={role.id} href={`/roles/${role.id}`}>
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
