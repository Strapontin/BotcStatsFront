import { Fragment, useCallback, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import {
  updatePlayer,
  getPlayerById,
  getAllPlayers,
  deletePlayer,
} from "../../../../data/back-api/back-api";
import {
  Button,
  Checkbox,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import classes from "../index.module.css";
import { Check, XOctagon } from "react-feather";
import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerPseudoString,
} from "@/entities/Player";
import { useRouter } from "next/router";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function UpdatePlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const [oldPlayer, setOldPlayer] = useState<Player>(getNewEmptyPlayer());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [playerCreateEditKey, setPlayerCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<Fragment />);
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());

  const [players, setPlayers] = useState<Player[]>([]);

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

  useEffect(() => {
    if (playerId === undefined || isNaN(playerId)) return;

    async function initPlayer() {
      const p = await getPlayerById(playerId);
      setPlayer(p);
      setOldPlayer(p);
    }
    initPlayer();

    async function initPlayers() {
      const e = await getAllPlayers();
      setPlayers(e);
    }
    initPlayers();
  }, [playerId]);

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
      setMessage(<Fragment />);
    }
  }, [player, players, oldPlayer]);

  if (player.id === -1) {
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );
  }

  const title = <Title>Modification du joueur {`'${oldPlayer.name}'`}</Title>;

  async function btnUpdatePlayer() {
    if (!canUpdatePlayer()) return;

    if (await updatePlayer(player)) {
      const r = await getPlayerById(playerId);
      setPlayer(r);
      setOldPlayer(r);
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
      if (await deletePlayer(oldPlayer.id)) {
        updateMessage(false, "Le joueur a été supprimé correctement.");
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
          Voulez-vous vraiment supprimer le joueur :{" '"}
          <Text b size={22}>
            {oldPlayer.name}
            {getPlayerPseudoString(oldPlayer.pseudo)}
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
        shadow
        ghost
        color="error"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer le joueur
      </Button>
      <Spacer y={3} />
      {popup}
    </Fragment>
  );
}
