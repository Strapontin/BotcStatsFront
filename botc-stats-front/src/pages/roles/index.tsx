import Filter from "@/components/filter/Filter";
import ListBoxRolesComponent from "@/components/list-stats/--ListBoxRolesComponent";
import Title from "@/components/ui/title";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Spacer, Spinner } from "@nextui-org/react";
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

  const filteredRoles = roles.filter((role) =>
    toLowerRemoveDiacritics(role.name).includes(toLowerRemoveDiacritics(filter))
  );

  return (
    <>
      {title}
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre rôle"
      />
      <ListBoxRolesComponent roles={filteredRoles} />
    </>
  );
}
