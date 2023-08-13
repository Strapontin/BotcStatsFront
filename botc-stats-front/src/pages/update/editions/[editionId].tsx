import { Fragment, useCallback, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import {
  updateEdition,
  getEditionById,
  getAllEditions,
  deleteEdition,
} from "../../../../data/back-api/back-api";
import { Button, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import classes from "../index.module.css";
import { Check, XOctagon } from "react-feather";
import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import { useRouter } from "next/router";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function UpdateEditionPage() {
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);

  const [oldEdition, setOldEdition] = useState<Edition>(getNewEmptyEdition());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [editionCreateEditKey, setEditionCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<Fragment />);
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());

  const [editions, setEditions] = useState<string[]>([]);

  const canUpdateEdition = useCallback(() => {
    if (edition.name === "") {
      updateMessage(true, "Un nom est obligatoire.");
      return false;
    } else if (
      editions.filter(
        (p) =>
          toLowerRemoveDiacritics(p) !==
            toLowerRemoveDiacritics(oldEdition.name) &&
          toLowerRemoveDiacritics(p) === toLowerRemoveDiacritics(edition.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un module avec ce nom existe déjà.");
      return false;
    } else {
      updateMessage(false, "");
      return true;
    }
  }, [edition, editions, oldEdition]);

  useEffect(() => {
    if (editionId === undefined || isNaN(editionId)) return;

    async function initEdition() {
      const e = await getEditionById(editionId);
      setEdition(e);
      setOldEdition(e);
    }
    initEdition();

    async function initEditions() {
      const e = (await getAllEditions()).map((e) => e.name);
      setEditions(e);
    }
    initEditions();
  }, [editionId]);

  // Updates message on component refreshes
  useEffect(() => {
    if (edition.name === "" && edition.roles.length === 0) return;

    canUpdateEdition();
  }, [edition, canUpdateEdition]);

  if (edition.id === -1) {
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );
  }

  const title = <Title>Modification du module {`'${oldEdition.name}'`}</Title>;

  async function btnUpdateEdition() {
    if (!canUpdateEdition()) return;

    if (await updateEdition(edition.id, edition.name, edition.roles)) {
      const g = await getEditionById(editionId);
      setEdition(g);
      setEditionCreateEditKey(editionCreateEditKey + 1);
      setTimeout(
        () =>
          updateMessage(
            false,
            `Le module '${edition.name}' a été modifié correctement.`
          ),
        50
      );
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de la modification du module."
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
      if (await deleteEdition(oldEdition.id)) {
        updateMessage(false, "Le module a été supprimé correctement.");
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
          Voulez-vous vraiment supprimer le module :{" '"}
          <Text b size={22}>
            {oldEdition.name}
          </Text>
          {"' "}?
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
      <EditionCreateEdit
        key={editionCreateEditKey}
        title={title}
        edition={edition}
        setEdition={setEdition}
        message={message}
        btnPressed={btnUpdateEdition}
        btnText="Modifier le module"
      />

      <Button
        shadow
        ghost
        color="error"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer le module
      </Button>
      <Spacer y={3} />
      {popup}
    </Fragment>
  );
}
