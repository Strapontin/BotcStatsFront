import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import Title from "@/components/ui/title";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerPseudoString,
} from "@/entities/Player";
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
  deletePlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
} from "../../../../data/back-api/back-api";
import classes from "../index.module.css";

export default function UpdatePlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const [oldPlayer, setOldPlayer] = useState<Player>(getNewEmptyPlayer());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [playerCreateEditKey, setPlayerCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<></>);
  const [players, setPlayers] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  useEffect(() => {
    if (!playerId) return;

    getAllPlayers().then((p) => {
      setPlayers(p);
    });
    getPlayerById(playerId).then((p) => {
      setOldPlayer(p);
      setPlayer(p);
    });
  }, [playerId]);

  const canUpdatePlayer = useCallback(() => {
    if (player.name === "") {
      updateMessage(true, "Un nom est obligatoire.");
      return false;
    } else if (
      players.filter(
        (p) =>
          toLowerRemoveDiacritics(p.name) ===
            toLowerRemoveDiacritics(player.name) &&
          toLowerRemoveDiacritics(p.pseudo) ===
            toLowerRemoveDiacritics(player.pseudo)
      ).length !== 0
    ) {
      const pseudoMsg = player.pseudo ? " (" + player.pseudo + ")" : "";
      updateMessage(
        true,
        `Le joueur "${player.name}${pseudoMsg}" existe déjà.`
      );
      return false;
    } else {
      updateMessage(false, "");
      return true;
    }
  }, [player, players]);

  // Updates message on component refreshes
  useEffect(() => {
    if (
      (player.name === "" && player.pseudo === "") ||
      (player.name === oldPlayer.name && player.pseudo === oldPlayer.pseudo)
    ) {
      updateMessage(false, "");
      return;
    }

    if (toLowerRemoveDiacritics(player.name) === "") {
      updateMessage(true, "Un nom est obligatoire.");
    } else if (
      players.filter(
        (p) =>
          toLowerRemoveDiacritics(p.name) ===
            toLowerRemoveDiacritics(player.name) &&
          toLowerRemoveDiacritics(p.pseudo) ===
            toLowerRemoveDiacritics(player.pseudo)
      ).length !== 0
    ) {
      const pseudoMsg = player.pseudo ? " (" + player.pseudo + ")" : "";
      updateMessage(
        true,
        `Le joueur "${player.name}${pseudoMsg}" existe déjà.`
      );
    } else {
      setMessage(<></>);
    }
  }, [player, players, oldPlayer]);

  if (player.id === -1) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const title = <Title>Modification du joueur {`'${oldPlayer.name}'`}</Title>;

  async function btnUpdatePlayer() {
    if (!canUpdatePlayer()) return;

    if (await updatePlayer(player, accessToken)) {
      const p = await getPlayerById(playerId);
      setPlayer(p);
      setOldPlayer(p);
      setPlayerCreateEditKey(playerCreateEditKey + 1);
      const pseudoMsg = player.pseudo ? " (" + player.pseudo + ")" : "";
      setTimeout(
        () =>
          updateMessage(
            false,
            `Le joueur "${player.name}${pseudoMsg}" a été modifié correctement.`
          ),
        50
      );
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de la modification du joueur."
      );
    }
  }

  function updateMessage(isError: boolean, message: string) {
    if (message === "") {
      setMessage(<></>);
    } else if (isError) {
      setMessage(
        <span className={classes.red}>
          <XOctagon className={classes.icon} />
          {message}
        </span>
      );
    } else {
      setMessage(
        <span className={classes.green}>
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
      if (await deletePlayer(oldPlayer.id, accessToken)) {
        updateMessage(false, "Le joueur a été supprimé correctement.");
        closePopupDelete();

        setTimeout(() => {
          router.push(
            router.asPath.substring(0, router.asPath.lastIndexOf("/"))
          );
        }, 1500);
      } else {
        updateMessage(
          true,
          "Une erreur s'est produite pendant la suppression du joueur."
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
            Voulez-vous vraiment supprimer le joueur :{" '"}
            <span>
              {oldPlayer.name}
              {getPlayerPseudoString(oldPlayer.pseudo)}
            </span>
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
      <PlayerCreateEdit
        key={playerCreateEditKey}
        title={title}
        player={player}
        setPlayer={setPlayer}
        message={message}
        btnPressed={btnUpdatePlayer}
        btnText="Modifier le joueur"
      />

      <Button
        color="danger"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer le joueur
      </Button>
      <Spacer y={3} />
      {popup}
    </>
  );
}
