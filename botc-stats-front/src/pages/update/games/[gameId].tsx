import GameCreateEdit from "@/components/create-edit/game-create-edit/GameCreateEdit";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { Game } from "@/entities/Game";
import { Player, getPlayerPseudoString } from "@/entities/Player";
import { Alignment } from "@/entities/enums/alignment";
import { dateToString } from "@/helper/date";
import AuthContext from "@/stores/authContext";
import { Button, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import { Check, XOctagon } from "react-feather";
import {
  deleteGame,
  getAllEditions,
  getAllGames,
  getAllPlayers,
  getGameById,
  updateGame,
} from "../../../../data/back-api/back-api";
import classes from "../index.module.css";

export default function UpdateGamePage({
  allPlayers,
  allEditions,
  gameLoaded,
}: {
  allPlayers: Player[];
  allEditions: Edition[];
  gameLoaded: Game;
}) {
  const router = useRouter();
  const gameId: number = Number(router.query.gameId);

  const [disableBtnDelete, setDisableBtnDelete] = useState(false);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);

  const [gameCreateEditKey, setGameCreateEditKey] = useState(0);
  const [message, setMessage] = useState(<Fragment />);
  const [game, setGame] = useState<Game>(gameLoaded);

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  if (game.id === -1) {
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );
  }

  const title = <Title>Modification d{"'"}une partie existante</Title>;

  async function btnUpdateGame() {
    if (!canUpdateGame()) return;

    if (await updateGame(game, accessToken)) {
      const g = await getGameById(gameId);
      setGame(g);
      setGameCreateEditKey(gameCreateEditKey + 1);
      updateMessage(false, `La partie a été modifiée correctement.`);
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de la modification de la partie."
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

  function canUpdateGame() {
    if (game.edition.id === -1) {
      updateMessage(true, "Un module est obligatoire.");
      return false;
    }
    if (game.storyTeller.id === -1) {
      updateMessage(true, "Un conteur est obligatoire.");
      return false;
    }
    if (dateToString(game.datePlayed) === "") {
      updateMessage(
        true,
        "La date à laquelle la partie a été jouée est obligatoire."
      );
      return false;
    }
    if (game.winningAlignment === Alignment.None) {
      updateMessage(true, "L'alignement gagnant est obligatoire.");
      return false;
    }

    return true;
  }

  function closePopupDelete() {
    setPopupDeleteVisible(false);
  }

  async function btnDeletePressed() {
    setDisableBtnDelete(true);
    setTimeout(async () => {
      if (await deleteGame(game.id, accessToken)) {
        updateMessage(false, "La partie a été supprimé correctement.");
        closePopupDelete();
        setTimeout(() => {
          router.push(
            router.asPath.substring(0, router.asPath.lastIndexOf("/"))
          );
        }, 1500);
      } else {
        updateMessage(
          true,
          "Une erreur s'est produite pendant la suppression de la partie."
        );
      }

      setDisableBtnDelete(false);
    }, 0);
  }

  const popup = (
    <Modal blur open={popupDeleteVisible} onClose={closePopupDelete}>
      <Modal.Header>
        <Text id="modal-title" size={22}>
          Voulez-vous vraiment supprimer la partie du{" "}
          <Text b size={22}>
            {dateToString(game.datePlayed)}
          </Text>{" "}
          contée par{" '"}
          <Text b size={22}>
            {game.storyTeller.name}
            {getPlayerPseudoString(game.storyTeller.pseudo)}
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
      <GameCreateEdit
        key={gameCreateEditKey}
        title={title}
        game={game}
        setGame={setGame}
        message={message}
        btnPressed={btnUpdateGame}
        btnText="Modifier la partie"
        allEditions={allEditions}
        allPlayers={allPlayers}
      />

      <Button
        shadow
        ghost
        color="error"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer la partie
      </Button>
      <Spacer y={3} />
      {popup}
    </Fragment>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { gameId: number };
}) {
  const { gameId } = params;
  const allPlayers = await getAllPlayers();
  const allEditions = await getAllEditions();
  const gameLoaded = await getGameById(gameId);

  return {
    props: {
      allPlayers,
      allEditions,
      gameLoaded,
    },
    revalidate: 10,
  };
}

export const getStaticPaths = async () => {
  const games = await getAllGames();

  const paths = games.map((game) => ({
    params: { gameId: game.id.toString() },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
};
