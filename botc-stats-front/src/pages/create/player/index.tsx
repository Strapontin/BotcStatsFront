import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import Title from "@/components/ui/title";
import {
  createNewPlayer,
  useGetPlayers,
} from "@/data/back-api/back-api-player";
import useApi from "@/data/back-api/useApi";
import { Player, getNewEmptyPlayer } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { useEffect, useState } from "react";
import { Check, XOctagon } from "react-feather";
import { mutate } from "swr";
import classes from "../index.module.css";

export default function CreatePlayer() {
  const [playerCreateEditKey, setPlayerCreateEditKey] = useState(0);
  const [message, setMessage] = useState(<></>);
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());

  const { data: players } = useGetPlayers();
  const api = useApi();

  // Updates message on component refreshes
  useEffect(() => {
    if (player.name === "" && player.pseudo === "") return;

    if (toLowerRemoveDiacritics(player.name) === "") {
      updateMessage(true, "Un nom est obligatoire.");
    } else if (
      players.filter(
        (p: Player) =>
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
  }, [player, players]);

  const title = <Title>Création d{"'"}un nouveau joueur</Title>;

  async function createPlayer() {
    if (player.name === "") return;

    if (await createNewPlayer(player, api)) {
      mutate(`${api.apiUrl}/Players`);
      setPlayer(getNewEmptyPlayer());

      updateMessage(
        false,
        `Le joueur "${player.name}" a été enregistré correctement.`
      );
      setPlayerCreateEditKey(playerCreateEditKey + 1);
    } else {
      //Erreur
      updateMessage(
        true,
        "Une erreur est survenue lors de l'enregistrement du joueur."
      );
    }
  }

  function updateMessage(isError: boolean, message: string) {
    if (isError) {
      setMessage(
        <span className={classes.red + " flex justify-center"}>
          <XOctagon className={classes.icon} />
          {message}
        </span>
      );
    } else {
      setMessage(
        <span className={classes.green + " flex justify-center"}>
          <Check className={classes.icon} />
          {message}
        </span>
      );
    }
  }

  return (
    <PlayerCreateEdit
      key={playerCreateEditKey}
      title={title}
      player={player}
      setPlayer={setPlayer}
      message={message}
      btnPressed={createPlayer}
      btnText="Créer un joueur"
    />
  );
}
