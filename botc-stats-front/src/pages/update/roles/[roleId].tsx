import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import Title from "@/components/ui/title";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import AuthContext from "@/stores/authContext";
import { Button, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Check, XOctagon } from "react-feather";
import {
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../../../../data/back-api/back-api";
import classes from "../index.module.css";

export default function UpdateRolePage({
  roles,
  roleLoaded,
}: {
  roles: Role[];
  roleLoaded: Role;
}) {
  const router = useRouter();
  const roleId: number = Number(router.query.roleId);

  const [oldRole, setOldRole] = useState<Role>(roleLoaded);
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [roleCreateEditKey, setRoleCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<Fragment />);
  const [role, setRole] = useState<Role>(roleLoaded);

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

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
      <Fragment>
        <Loading />
      </Fragment>
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
    <Modal blur open={popupDeleteVisible} onClose={closePopupDelete}>
      <Modal.Header>
        <Text span id="modal-title" size={22}>
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
          shadow
          ghost
          color="error"
          onPress={() => setPopupDeleteVisible(true)}
          disabled={disableBtnDelete}
        >
          Supprimer le rôle
        </Button>
      </div>
      <Spacer y={3} />
      {popup}
    </Fragment>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { roleId: number };
}) {
  const { roleId } = params;
  const roleLoaded = await getRoleById(roleId);
  const roles = await getAllRoles();

  return {
    props: { roles, roleLoaded },
    revalidate: 10,
  };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: true };
};
