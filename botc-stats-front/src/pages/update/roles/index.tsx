import Filter from "@/components/filter/Filter";
import ListboxRolesComponent from "@/components/listbox/ListboxRolesComponent";
import Title from "@/components/ui/title";
import { useGetRoles } from "@/data/back-api/back-api-role";
import { Role } from "@/entities/Role";
import { stringContainsString } from "@/helper/string";
import { Spacer, Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function UpdateRolesPage() {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Modifier un rôle</Title>;

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
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre rôle"
      />
      <ListboxRolesComponent
        roles={filteredRoles}
        hrefRoles="/update/roles/ROLE_ID"
      />
    </>
  );
}
