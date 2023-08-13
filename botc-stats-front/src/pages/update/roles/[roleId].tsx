import { Fragment, useCallback, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import {
  updateRole,
  getRoleById,
  getAllRoles,
  deleteRole,
} from "../../../../data/back-api/back-api";
import { Button, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import classes from "../index.module.css";
import { Check, XOctagon } from "react-feather";
import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import { Role, getNewEmptyRole } from "@/entities/Role";
import { useRouter } from "next/router";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function UpdateRolePage() {
  const router = useRouter();
  const roleId: number = Number(router.query.roleId);

  const [oldRole, setOldRole] = useState<Role>(getNewEmptyRole());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [roleCreateEditKey, setRoleCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<Fragment />);
  const [role, setRole] = useState<Role>(getNewEmptyRole());

  const [roles, setRoles] = useState<string[]>([]);

  const canUpdateRole = useCallback(() => {
    if (role.name === "") {
      updateMessage(true, "Un nom est obligatoire.");
      return false;
    } else if (
      roles.filter(
        (p) =>
          toLowerRemoveDiacritics(p) !==
            toLowerRemoveDiacritics(oldRole.name) &&
          toLowerRemoveDiacritics(p) === toLowerRemoveDiacritics(role.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un rôle avec ce nom existe déjà.");
      return false;
    } else {
      updateMessage(false, "");
      return true;
    }
  }, [role, roles, oldRole]);

  useEffect(() => {
    if (roleId === undefined || isNaN(roleId)) return;

    async function initRole() {
      const e = await getRoleById(roleId);
      setRole(e);
      setOldRole(e);
    }
    initRole();

    async function initRoles() {
      const e = (await getAllRoles()).map((e) => e.name);
      setRoles(e);
    }
    initRoles();
  }, [roleId]);

  // Updates message on component refreshes
  useEffect(() => {
    if (
      role.name === oldRole.name &&
      role.characterType === oldRole.characterType &&
      role.alignment === oldRole.alignment
    )
      return;

    if (toLowerRemoveDiacritics(role.name) === "") {
      updateMessage(true, "Un nom est obligatoire.");
    } else if (
      roles.filter(
        (p) => toLowerRemoveDiacritics(p) === toLowerRemoveDiacritics(role.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un rôle avec ce nom existe déjà.");
    } else {
      setMessage(<Fragment />);
    }
  }, [role, roles, oldRole]);

  if (role.id === -1) {
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );
  }

  const title = <Title>Modification du rôle {`'${oldRole.name}'`}</Title>;

  async function btnUpdateRole() {
    if (!canUpdateRole()) return;

    if (await updateRole(role)) {
      const r = await getRoleById(roleId);
      setRole(r);
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
      setMessage(<Fragment />);
    } else if (isError) {
      setMessage(
        <Text span className={classes.red}>
          <XOctagon className={classes.icon} />
          {message}
        </Text>
      );
    } else {
      setMessage(
        <Text span className={classes.green}>
          <Check className={classes.icon} />
          {message}
        </Text>
      );
    }
  }

  function closePopupDelete() {
    setPopupDeleteVisible(false);
  }

  async function btnDeletePressed() {
    setDisableBtnDelete(true);
    setTimeout(async () => {
      if (await deleteRole(oldRole.id)) {
        updateMessage(false, "Le rôle a été supprimé correctement.");
        closePopupDelete();
      }
      setTimeout(() => {
        router.push(router.asPath.substring(0, router.asPath.lastIndexOf("/")));
      }, 1500);

      setDisableBtnDelete(false);
    }, 0);
  }

  const popup = (
    <Modal blur open={popupDeleteVisible} onClose={closePopupDelete}>
      <Modal.Header>
        <Text id="modal-title" size={22}>
          Voulez-vous vraiment supprimer le rôle :{" '"}
          <Text b size={22}>
            {oldRole.name}
          </Text>
          {"' "}?
          <br />
          <Text size={14}>
            Si ce rôle est dans un module, il sera également supprimé de
            celui-ci.
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Footer css={{ justifyContent: "space-around" }}>
        <Button auto flat color="error" onPress={btnDeletePressed}>
          Confirmer
        </Button>
        <Button auto onPress={closePopupDelete}>
          Annuler
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Fragment>
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
        shadow
        ghost
        color="error"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer le rôle
      </Button>
      <Spacer y={3} />
      {popup}
    </Fragment>
  );
}
