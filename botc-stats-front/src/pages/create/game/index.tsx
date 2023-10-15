import GameCreateEdit from "@/components/create-edit/game-create-edit/GameCreateEdit";
import Title from "@/components/ui/title";
import { Edition } from "@/entities/Edition";
import { Game, getNewEmptyGame } from "@/entities/Game";
import { Player } from "@/entities/Player";
import { Alignment } from "@/entities/enums/alignment";
import { dateToString } from "@/helper/date";
import AuthContext from "@/stores/authContext";
import { Text } from "@nextui-org/react";
import { useContext, useState } from "react";
import { Check, XOctagon } from "react-feather";
import {
  createNewGame,
  getAllEditions,
  getAllPlayers,
} from "../../../../data/back-api/back-api";
import classes from "../index.module.css";

export default function CreateGame({
  editions,
  players,
}: {
  editions: Edition[];
  players: Player[];
}) {
  const [gameCreateEditKey, setGameCreateEditKey] = useState(0);
  const [message, setMessage] = useState(<></>);
  const [game, setGame] = useState<Game>(getNewEmptyGame());

  const title = <Title>Création d{"'"}une nouvelle partie</Title>;

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  async function createGame() {
    if (!canCreateGame()) return;

    if (await createNewGame(game, accessToken)) {
      setGame(getNewEmptyGame());
      setGameCreateEditKey(gameCreateEditKey + 1);
      updateMessage(false, `La partie a été enregistrée correctement.`);
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de l'enregistrement de la partie."
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

  function canCreateGame() {
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

  return (
    <GameCreateEdit
      key={gameCreateEditKey}
      title={title}
      game={game}
      setGame={setGame}
      message={message}
      btnPressed={createGame}
      btnText="Créer une partie"
      allEditions={editions}
      allPlayers={players}
    />
  );
}

export async function getServerSideProps() {
  const editions = await getAllEditions();
  const players = await getAllPlayers();

  return {
    props: {
      editions,
      players,
    },
  };
}
