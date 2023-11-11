import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import Title from "@/components/ui/title";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import { Role } from "@/entities/Role";
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
  deleteEdition,
  getAllEditions,
  getAllRoles,
  getEditionById,
  updateEdition,
} from "../../../../data/back-api/back-api";
import classes from "../index.module.css";

export default function UpdateEditionPage() {
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);

  const [oldEdition, setOldEdition] = useState<Edition>(getNewEmptyEdition());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [editionCreateEditKey, setEditionCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<></>);
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());
  const [editions, setEditions] = useState<Edition[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  useEffect(() => {
    if (editionId === undefined || isNaN(editionId)) return;

    getEditionById(editionId).then((e) => {
      setOldEdition(e);
      setEdition(e);
    });
    getAllEditions().then((e) => setEditions(e));
    getAllRoles().then((r) => setRoles(r));
  }, [editionId]);

  const canUpdateEdition = useCallback(() => {
    if (edition.name === "") {
      updateMessage(true, "Un nom est obligatoire.");
      return false;
    } else if (
      editions.filter(
        (e) =>
          toLowerRemoveDiacritics(e.name) !==
            toLowerRemoveDiacritics(oldEdition.name) &&
          toLowerRemoveDiacritics(e.name) ===
            toLowerRemoveDiacritics(edition.name)
      ).length !== 0
    ) {
      updateMessage(true, "Un module avec ce nom existe déjà.");
      return false;
    } else {
      updateMessage(false, "");
      return true;
    }
  }, [edition, editions, oldEdition]);

  // Updates message on component refreshes
  useEffect(() => {
    if (edition.name === "" && edition.roles.length === 0) return;

    canUpdateEdition();
  }, [edition, canUpdateEdition]);

  if (edition.id === -1) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const title = <Title>Modification du module {`'${oldEdition.name}'`}</Title>;

  async function btnUpdateEdition() {
    if (!canUpdateEdition()) return;

    if (
      await updateEdition(edition.id, edition.name, edition.roles, accessToken)
    ) {
      const e = await getEditionById(editionId);
      setEditions([...editions, edition]);
      setEdition(e);
      setOldEdition(e);
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
      if (await deleteEdition(oldEdition.id, accessToken)) {
        updateMessage(false, "Le module a été supprimé correctement.");
        closePopupDelete();
        setTimeout(() => {
          router.push(
            router.asPath.substring(0, router.asPath.lastIndexOf("/"))
          );
        }, 1500);
      } else {
        updateMessage(
          true,
          "Une erreur s'est produite pendant la suppression du module."
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
            Voulez-vous vraiment supprimer le module :{" '"}
            <span>{oldEdition.name}</span>
            {"' "}?
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
      <EditionCreateEdit
        key={editionCreateEditKey}
        title={title}
        edition={edition}
        setEdition={setEdition}
        message={message}
        btnPressed={btnUpdateEdition}
        btnText="Modifier le module"
        roles={roles}
      />

      <Button
        color="danger"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer le module
      </Button>
      <Spacer y={3} />
      {popup}
    </>
  );
}
