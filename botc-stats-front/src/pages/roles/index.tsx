import Filter from "@/components/filter/Filter";
import ListboxRolesComponent from "@/components/listbox/ListboxRolesComponent";
import Title from "@/components/ui/title";
import { useGetRoles } from "@/data/back-api/back-api-role";
import { Role } from "@/entities/Role";
import { stringContainsString } from "@/helper/string";
import AuthContext from "@/stores/authContext";
import { Button, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Plus } from "react-feather";

export default function RolesPage() {
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const user = useContext(AuthContext);
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
      <div className={user.isStoryTeller ? "" : "hidden"}>
        <Button
          className="flex"
          color="success"
          startContent={<Plus className="h-4" />}
          onPress={() => router.push(`/create/role`)}
        >
          Ajouter un nouveau rôle
        </Button>
        <Spacer y={3} />
      </div>
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre rôle"
      />
      <ListboxRolesComponent
        roles={filteredRoles}
        // hrefRoles="roles/ROLE_ID"
      />
    </>
  );
}
