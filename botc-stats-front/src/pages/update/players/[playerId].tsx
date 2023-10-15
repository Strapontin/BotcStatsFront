import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import Title from "@/components/ui/title";
import { Player, getPlayerPseudoString } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import AuthContext from "@/stores/authContext";
import { Button, Loading, Modal, Spacer, Text } from "@nextui-org/react";
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

export default function UpdatePlayerPage({
  allPlayers,
  playerLoaded,
}: {
  allPlayers: Player[];
  playerLoaded: Player;
}) {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const [oldPlayer, setOldPlayer] = useState<Player>(playerLoaded);
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [playerCreateEditKey, setPlayerCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<></>);
  const [players] = useState<Player[]>(allPlayers);
  const [player, setPlayer] = useState<Player>(playerLoaded);

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

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
        <Loading />
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
    </>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { playerId: number };
}) {
  const allPlayers = await getAllPlayers();
  const playerLoaded = allPlayers.find((r) => r.id == params.playerId);

  if (!playerLoaded) {
    return { notFound: true };
  }

  return { props: { allPlayers, playerLoaded } };
}
