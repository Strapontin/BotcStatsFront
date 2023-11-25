import GameCreateEdit from "@/components/create-edit/game-create-edit/GameCreateEdit";
import Title from "@/components/ui/title";
import { useGetEditions } from "@/data/back-api/back-api-edition";
import { createNewGame } from "@/data/back-api/back-api-game";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import useApi from "@/data/back-api/useApi";
import { Game, getNewEmptyGame } from "@/entities/Game";
import { Alignment } from "@/entities/enums/alignment";
import { useState } from "react";
import { mutate } from "swr";

export default function CreateGame() {
  const [game, setGame] = useState<Game>(getNewEmptyGame());

  const api = useApi();

  const title = <Title>Création d{"'"}une nouvelle partie</Title>;

  async function createGame() {
    if (!canCreateGame()) return;

    if (await createNewGame(game, api)) {
      mutate(`${api.apiUrl}/Games`);
      setGame(getNewEmptyGame());
    }
  }

  function canCreateGame() {
    if (game.edition.id === -1) {
      return false;
    }
    if (game.storyTeller.id === -1) {
      return false;
    }
    if (game.winningAlignment === Alignment.None) {
      return false;
    }

    return true;
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
