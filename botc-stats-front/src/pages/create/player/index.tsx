import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import Title from "@/components/ui/title";
import { toastPromise } from "@/components/toast/toast";
import {
  createNewPlayer,
  useGetPlayers,
} from "@/data/back-api/back-api-player";
import useApi from "@/data/back-api/useApi";
import { Player, getNewEmptyPlayer } from "@/entities/Player";
import { useState } from "react";
import { mutate } from "swr";

export default function CreatePlayer() {
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());

  const { data: players } = useGetPlayers();
  const api = useApi();

  const title = <Title>Création d{"'"}un nouveau joueur</Title>;

  async function createPlayer() {
    const createPlayer = createNewPlayer(player, api);
    toastPromise(createPlayer, "Enregistrement de l'utilisateur...");

    if (await createPlayer) {
      mutate(`${api.apiUrl}/Players`);
      setPlayer(getNewEmptyPlayer());
    }
  }

  return (
    <PlayerCreateEdit
      title={title}
      player={player}
      setPlayer={setPlayer}
      players={players}
      btnPressed={createPlayer}
      btnText="Créer un joueur"
    />
  );
}
