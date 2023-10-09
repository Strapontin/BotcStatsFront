import { Fragment, useContext, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import {
  createNewEdition,
  getAllEditions,
  getAllRoles,
} from "../../../../data/back-api/back-api";
import { Text } from "@nextui-org/react";
import classes from "../index.module.css";
import { Check, XOctagon } from "react-feather";
import { toLowerRemoveDiacritics } from "@/helper/string";
import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import AuthContext from "@/stores/authContext";
import { Role } from "@/entities/Role";

export default function CreateEdition({
  editions,
  roles,
}: {
  editions: Edition[];
  roles: Role[];
}) {
  const [editionCreateEditKey, setEditionCreateEditKey] = useState(0);
  const [message, setMessage] = useState(<Fragment />);
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  // Updates message on component refreshes
  useEffect(() => {
    if (edition.name === "" && edition.roles.length === 0) return;
    if (toLowerRemoveDiacritics(edition.name) === "") {
      updateMessage(true, "Un nom est obligatoire.");
    } else if (
      editions.filter(
        (e) =>
          toLowerRemoveDiacritics(e.name) ===
          toLowerRemoveDiacritics(edition.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un module avec ce nom existe déjà.");
    } else {
      setMessage(<Fragment />);
    }
  }, [edition, editions]);

  const title = <Title>Création d{"'"}un nouveau module</Title>;

  async function createEdition() {
    if (!canCreateEdition()) return;

    if (
      await createNewEdition(
        edition.name,
        edition.roles.map((r) => r.id),
        accessToken
      )
    ) {
      editions.push(edition);
      setEdition(getNewEmptyEdition());
      setEditionCreateEditKey(editionCreateEditKey + 1);
      updateMessage(false, `Le module a été enregistrée correctement.`);
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de l'enregistrement du module."
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

  function canCreateEdition() {
    if (toLowerRemoveDiacritics(edition.name) === "") {
      updateMessage(true, "Un nom est obligatoire.");
      return false;
    }

    if (
      editions.filter(
        (e) =>
          toLowerRemoveDiacritics(e.name) ===
          toLowerRemoveDiacritics(edition.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un module avec ce nom existe déjà.");
      return false;
    }

    return true;
  }

  return (
    <EditionCreateEdit
      key={editionCreateEditKey}
      title={title}
      edition={edition}
      setEdition={setEdition}
      message={message}
      btnPressed={createEdition}
      btnText="Créer un module"
      roles={roles}
    />
  );
}

export async function getStaticProps() {
  const editions = await getAllEditions();
  const roles = await getAllRoles();

  return {
    props: {
      editions,
      roles,
    },
    revalidate: 10,
  };
}