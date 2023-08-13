import { Fragment, useEffect, useRef, useState } from "react";
import Title from "@/components/ui/title";
import { createNewRole, getAllRoles } from "../../../../data/back-api/back-api";
import { Text } from "@nextui-org/react";
import classes from "../index.module.css";
import { Check, XOctagon } from "react-feather";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Alignment } from "@/entities/enums/alignment";
import { CharacterType } from "@/entities/enums/characterType";
import RoleCreateEdit from "@/components/create-edit/role-create-edit/RoleCreateEdit";
import { Role, getNewEmptyRole } from "@/entities/Role";

export default function CreateRole() {
  const [roleCreateEditKey, setRoleCreateEditKey] = useState(0);
  const [message, setMessage] = useState(<Fragment />);
  const [role, setRole] = useState<Role>(getNewEmptyRole());

  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    async function initRoles() {
      const tempRoles = (await getAllRoles()).map((role) => {
        return role.name;
      });
      setRoles(tempRoles);
    }
    initRoles();
  }, []);

  // Updates message on component refreshes
  useEffect(() => {
    if (
      role.name === "" &&
      role.characterType === CharacterType.None &&
      role.alignment === Alignment.None
    )
      return;

    if (toLowerRemoveDiacritics(role.name) === "") {
      updateMessage(true, "Un nom est obligatoire.");
    } else if (
      roles.filter(
        (p) => toLowerRemoveDiacritics(p) === toLowerRemoveDiacritics(role.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un module avec ce nom existe déjà.");
    } else {
      setMessage(<Fragment />);
    }
  }, [role, roles]);

  const title = <Title>Création d{"'"}un nouveau rôle</Title>;

  async function createRole() {
    if (
      role.characterType === undefined ||
      role.characterType === CharacterType.None ||
      role.alignment === undefined ||
      role.alignment === Alignment.None
    )
      return;

    if (await createNewRole(role.name, role.characterType, role.alignment)) {
      setRole(getNewEmptyRole());

      updateMessage(false, `Rôle "${role.name}" enregistré correctement.`);
      setRoleCreateEditKey(roleCreateEditKey + 1);
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de l'enregistrement du rôle."
      );
    }
  }

  function updateMessage(isError: boolean, message: string) {
    if (isError) {
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

  return (
    <RoleCreateEdit
      key={roleCreateEditKey}
      title={title}
      role={role}
      setRole={setRole}
      message={message}
      btnPressed={createRole}
      btnText="Créer un module"
    />
  );
}
