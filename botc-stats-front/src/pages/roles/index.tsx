import Filter from "@/components/filter/Filter";
import ListboxRolesComponent from "@/components/list-stats/ListboxRolesComponent";
import Title from "@/components/ui/title";
import { useGetRoles } from "@/data/back-api/back-api-role";
import { Role } from "@/entities/Role";
import { stringContainsString } from "@/helper/string";
import { Spacer, Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function RolesPage() {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Liste des rôles</Title>;

  const { data: roles, isLoading } = useGetRoles();

  if (isLoading) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const filteredRoles = roles.filter((role: Role) =>
    stringContainsString(role.name, filter)
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
      <ListboxRolesComponent
        selectedRoles={filteredRoles}
        // hrefRoles="roles/ROLE_ID"
      />
    </>
  );
}
