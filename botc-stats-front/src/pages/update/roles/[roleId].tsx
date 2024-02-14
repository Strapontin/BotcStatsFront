import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deleteRole,
  updateRole,
  useGetRoles,
} from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { Role, getNewEmptyRole } from "@/entities/Role";
import NotFoundPage from "@/pages/404";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function UpdateRolePage() {
  const router = useRouter();
  const roleId: number = Number(router.query.roleId);

  const {
    isOpen: popupDeleteVisible,
    onOpen: openPopupDelete,
    onClose: closePopupDelete,
  } = useDisclosure();

  const { data: roles, isLoading } = useGetRoles();
  const [role, setRole] = useState<Role>(getNewEmptyRole());
  const [oldRole, setOldRole] = useState<Role>(getNewEmptyRole());
  const api = useApi();
  const roleData = roles?.find((r: Role) => r.id === roleId);

  useEffect(() => {
    if (!roleData) return;
    setRole(roleData);
    setOldRole(roleData);
  }, [roleData]);

  if (isLoading || !role || !oldRole) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (!roleData) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = <Title>Modification du rôle {`'${oldRole.name}'`}</Title>;

  async function btnUpdateRole() {
    const update = updateRole(role, api);
    toastPromise(update, `Mise à jour du rôle '${oldRole.name}'`);

    if (await update) {
      mutateRoutes();
    }
  }

  async function btnDeletePressed() {
    const delRole = deleteRole(oldRole.id, api);
    toastPromise(delRole, `Suppression du rôle '${oldRole.name}'`);

    if (await delRole) {
      mutateRoutes();
      router.push("/roles");
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
      <Button color="danger" onPress={openPopupDelete}>
        Supprimer le rôle
      </Button>

      <Spacer y={3} />

      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={closePopupDelete}
      >
        <ModalContent>
          <ModalHeader>
            <span id="modal-title">
              {`Voulez-vous vraiment supprimer le rôle : '
              ${oldRole.name}
              ' ?`}
              <br />
              {`Si ce rôle est dans un module, il sera également supprimé de
                celui-ci.`}
            </span>
          </ModalHeader>
          <ModalFooter>
            <Button color="danger" onPress={btnDeletePressed}>
              Confirmer
            </Button>
            <Button onPress={closePopupDelete}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
