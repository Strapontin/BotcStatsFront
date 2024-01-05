import GameCreateEdit from "@/components/create-edit/game-create-edit/GameCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import { createNewGame } from "@/data/back-api/back-api-game";
import useApi from "@/data/back-api/useApi";
import { Game, getNewEmptyGame } from "@/entities/Game";
import { useState } from "react";
import { mutate } from "swr";

export default function CreateGame() {
  const [game, setGame] = useState<Game>(getNewEmptyGame());

  const api = useApi();

  const title = <Title>Création d{"'"}une nouvelle partie</Title>;

  async function createGame() {
    const createGame = createNewGame(game, api);
    toastPromise(createGame, "Enregistrement de la partie...");

    if (await createGame) {
      mutate(`${api.apiUrl}/Games`);
      setGame((prevGame) => ({
        ...getNewEmptyGame(),
        edition: prevGame.edition,
        storyteller: prevGame.storyteller,
        datePlayed: prevGame.datePlayed,
      }));
    }
  }

  return (
    <GameCreateEdit
      title={title}
      game={game}
      setGame={setGame}
      btnPressed={createGame}
      btnText="Créer une partie"
    />
  );
}
