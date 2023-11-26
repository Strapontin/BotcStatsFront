import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import Title from "@/components/ui/title";
import { Role, getNewEmptyRole } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import AuthContext from "@/stores/authContext";
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
import { useCallback, useContext, useEffect, useState } from "react";
import { Check, XOctagon } from "react-feather";
import {
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../../../../data/back-api/back-api";
import classes from "../index.module.css";

export default function UpdateRolePage() {
  const router = useRouter();
  const roleId: number = Number(router.query.roleId);

  const [oldRole, setOldRole] = useState<Role>(getNewEmptyRole());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [roleCreateEditKey, setRoleCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<></>);
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role>(getNewEmptyRole());

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  useEffect(() => {
    if (!roleId) return;

    getAllRoles().then((r) => setRoles(r));
    getRoleById(roleId).then((r) => {
      setOldRole(r);
      setRole(r);
    });
  }, [roleId]);

  const canUpdateRole = useCallback(() => {
    if (role.name === "") {
      updateMessage(true, "Un nom est obligatoire.");
      return false;
    } else if (
      roles.filter(
        (r) =>
          toLowerRemoveDiacritics(r.name) !==
            toLowerRemoveDiacritics(oldRole.name) &&
          toLowerRemoveDiacritics(r.name) === toLowerRemoveDiacritics(role.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un rôle avec ce nom existe déjà.");
      return false;
    } else {
      updateMessage(false, "");
      return true;
    }
  }, [role, roles, oldRole]);

  // Updates message on component refreshes
  useEffect(() => {
    if (
      role.name === oldRole.name &&
      role.characterType === oldRole.characterType &&
      role.alignment === oldRole.alignment
    )
      return;

    canUpdateRole();
  }, [role, roles, oldRole, canUpdateRole]);

  if (role.id === -1) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const title = <Title>Modification du rôle {`'${oldRole.name}'`}</Title>;

  async function btnUpdateRole() {
    if (!canUpdateRole()) return;

    if (await updateRole(role, accessToken)) {
      const r = await getRoleById(roleId);
      setRole(r);
      setOldRole(r);
      setRoleCreateEditKey(roleCreateEditKey + 1);
      setTimeout(
        () =>
          updateMessage(
            false,
            `Le rôle '${role.name}' a été modifié correctement.`
          ),
        50
      );
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de la modification du rôle."
      );
    }
  }

  function updateMessage(isError: boolean, message: string) {
    if (message === "") {
      setMessage(<></>);
    } else if (isError) {
      setMessage(
        <span className={classes.red + " flex justify-center"}>
          <XOctagon className={classes.icon} />
          {message}
        </span>
      );
    } else {
      setMessage(
        <span className={classes.green + " flex justify-center"}>
          <Check className={classes.icon} />
          {message}
        </span>
      );
    }
  }

  function closePopupDelete() {
    setPopupDeleteVisible(false);
  }

  async function btnDeletePressed() {
    setDisableBtnDelete(true);
    setTimeout(async () => {
      if (await deleteRole(oldRole.id, accessToken)) {
        updateMessage(false, "Le rôle a été supprimé correctement.");
        closePopupDelete();

        setTimeout(() => {
          router.push(
            router.asPath.substring(0, router.asPath.lastIndexOf("/"))
          );
        }, 1500);
      } else {
        updateMessage(
          true,
          "Une erreur s'est produite pendant la suppression du rôle."
        );
      }

      setDisableBtnDelete(false);
    }, 0);
  }

  const popup = (
    <Modal
      backdrop="blur"
      isOpen={popupDeleteVisible}
      onClose={closePopupDelete}
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
          <Button variant="flat" color="danger" onPress={btnDeletePressed}>
            Confirmer
          </Button>
          <Button onPress={closePopupDelete}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <div className="toto">
        <RoleCreateEdit
          key={roleCreateEditKey}
          title={title}
          role={role}
          setRole={setRole}
          message={message}
          btnPressed={btnUpdateRole}
          btnText="Modifier le rôle"
        />

        <Button
          color="danger"
          onPress={() => setPopupDeleteVisible(true)}
          disabled={disableBtnDelete}
        >
          Supprimer le rôle
        </Button>
      </div>
      <Spacer y={3} />
      {popup}
    </>
  );
}
