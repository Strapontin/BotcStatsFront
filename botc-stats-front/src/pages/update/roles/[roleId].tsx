import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import Title from "@/components/ui/title";
import {
  deleteRole,
  updateRole,
  useGetRoleById,
  useGetRoles,
} from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { Role } from "@/entities/Role";
import NotFoundPage from "@/pages/404";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function UpdateRolePage() {
  const router = useRouter();
  const roleId: number = Number(router.query.roleId);

  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);

  const { data: roleData, isLoading } = useGetRoleById(roleId);
  const { data: roles } = useGetRoles();
  const [role, setRole] = useState<Role>(roleData);
  const [oldRole, setOldRole] = useState<Role>(roleData);
  const api = useApi();

  useEffect(() => {
    setRole(roleData);
    setOldRole(roleData);
  }, [roleData]);

  if (isLoading || !role) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (roleData.status === 404) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = <Title>Modification du rôle {`'${oldRole.name}'`}</Title>;

  function canUpdateRole() {
    if (
      !role ||
      role.name === "" ||
      roles.some((p: Role) => p.id !== role.id && p.name === role.name)
    )
      return false;
    return true;
  }

  async function btnUpdateRole() {
    if (!canUpdateRole()) return;

    if (await updateRole(role, api)) {
      mutateRoutes();
    }
  }

  async function btnDeletePressed() {
    if (await deleteRole(oldRole.id, api)) {
      mutateRoutes();

      setTimeout(() => {
        router.push(router.asPath.substring(0, router.asPath.lastIndexOf("/")));
      }, 0);
    }
  }

  function mutateRoutes() {
    mutate(`${api.apiUrl}/Roles`);
    mutate(`${api.apiUrl}/Roles/${role.id}`);
  }

  return (
    <>
      <RoleCreateEdit
        title={title}
        role={role}
        setRole={setRole}
        roles={roles}
        btnPressed={btnUpdateRole}
        btnText="Modifier le rôle"
      />
      <Button color="danger" onPress={() => setPopupDeleteVisible(true)}>
        Supprimer le rôle
      </Button>

      <Spacer y={3} />

      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={() => setPopupDeleteVisible(false)}
      >
        <ModalContent>
          <ModalHeader>
            <span id="modal-title">
              Voulez-vous vraiment supprimer le rôle :{" '"}
              <span>{oldRole.name}</span>
              {"' "}?
              <br />
              <span>
                Si ce rôle est dans un module, il sera également supprimé de
                celui-ci.
              </span>
            </span>
          </ModalHeader>
          <ModalFooter>
            <Button color="danger" onPress={btnDeletePressed}>
              Confirmer
            </Button>
            <Button onPress={() => setPopupDeleteVisible(false)}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
