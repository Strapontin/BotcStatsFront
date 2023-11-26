import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import Title from "@/components/ui/title";
import { createNewRole, useGetRoles } from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { Role, getNewEmptyRole } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { CharacterType } from "@/entities/enums/characterType";
import { useState } from "react";
import { mutate } from "swr";

export default function CreateRole() {
  const [role, setRole] = useState<Role>(getNewEmptyRole());

  const { data: roles } = useGetRoles();
  const api = useApi();

  const title = <Title>Création d{"'"}un nouveau rôle</Title>;

  async function createRole() {
    if (
      role.characterType === undefined ||
      role.characterType === CharacterType.None ||
      role.alignment === undefined ||
      role.alignment === Alignment.None
    )
      return;

    if (await createNewRole(role, api)) {
      mutate(`${api.apiUrl}/Roles`);
      setRole(getNewEmptyRole());
    }
  }

  return (
    <RoleCreateEdit
      title={title}
      role={role}
      setRole={setRole}
      roles={roles}
      btnPressed={createRole}
      btnText="Créer un rôle"
    />
  );
}
