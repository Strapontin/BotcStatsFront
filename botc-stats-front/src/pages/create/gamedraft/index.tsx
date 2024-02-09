import GameDraftCreateEdit from "@/components/create-edit/game-draft-create-edit/GameDraftCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import { createNewGameDraft } from "@/data/back-api/back-api-game-draft";
import useApi from "@/data/back-api/useApi";
import { GameDraft, getNewEmptyGameDraft } from "@/entities/GameDraft";
import { useState } from "react";
import { mutate } from "swr";

export default function CreateGameDraft() {
  const [gameDraft, setGameDraft] = useState<GameDraft>(getNewEmptyGameDraft());

  const api = useApi();

  const title = <Title>Création d{"'"}une nouvelle partie de rappel</Title>;

  async function createGameDraft() {
    const createGameDraft = createNewGameDraft(gameDraft, api);
    toastPromise(createGameDraft, "Enregistrement de la partie de rappel...");

    if (await createGameDraft) {
      mutate(`${api.apiUrl}/Games`);
      setGameDraft((prevGame) => ({
        ...getNewEmptyGameDraft(),
        edition: prevGame.edition,
        storyteller: prevGame.storyteller,
        datePlayed: prevGame.datePlayed,
      }));
    }
  }

  return (
    <GameDraftCreateEdit
      title={title}
      gameDraft={gameDraft}
      setGameDraft={setGameDraft}
      btnPressed={createGameDraft}
      btnText="Créer une partie de rappel"
    />
  );
}
