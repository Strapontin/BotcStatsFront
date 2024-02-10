import GameCreateEdit from "@/components/create-edit/game-create-edit/GameCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import { createNewGame } from "@/data/back-api/back-api-game";
import { useGetGameDraftById } from "@/data/back-api/back-api-game-draft";
import useApi from "@/data/back-api/useApi";
import { Game, getNewEmptyGame } from "@/entities/Game";
import { Spinner } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function CreateGame() {
  const api = useApi();

  const [game, setGame] = useState<Game>(getNewEmptyGame());
  const [gameKey, setGameKey] = useState(0);

  const searchParams = useSearchParams();
  const gameDraftId = Number(searchParams.get("gameDraftId"));
  const { data: gameDraft, isLoading: gameDraftIsLoading } =
    useGetGameDraftById(gameDraftId);
  const [oldGameDraft, setOldGameDraft] = useState(gameDraft);

  useEffect(() => {
    console.log(gameDraft, oldGameDraft);
    if (gameDraft !== oldGameDraft || (gameKey === 0 && gameDraft !== null)) {
      setOldGameDraft(gameDraft);
      setGame({
        ...game,
        edition: gameDraft.edition,
        storyteller: gameDraft.storyteller,
        datePlayed: gameDraft.datePlayed,
        notes: gameDraft.notes,
      });
      setGameKey((prev) => prev + 1);
    }
  }, [game, gameDraft, gameKey, oldGameDraft]);

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
      key={gameKey}
      title={title}
      game={game}
      setGame={setGame}
      btnPressed={createGame}
      btnText="Créer une partie"
    />
  );
}
