import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import { createNewRole, useGetRoles } from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { Role, getNewEmptyRole } from "@/entities/Role";
import { useState } from "react";
import { mutate } from "swr";

export default function CreateRole() {
  const [role, setRole] = useState<Role>(getNewEmptyRole());

  const { data: roles } = useGetRoles();
  const api = useApi();

  const title = <Title>Création d{"'"}un nouveau rôle</Title>;

  async function createRole() {

    const createRole = createNewRole(role, api);
    toastPromise(createRole, "Enregistrement du rôle...");

    if (await createRole) {
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
