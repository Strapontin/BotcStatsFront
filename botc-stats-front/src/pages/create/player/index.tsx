import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Title from "@/components/ui/title";
import {
  createNewPlayer,
  getAllPlayers,
} from "../../../../data/back-api/back-api";
import { Text } from "@nextui-org/react";
import classes from "../index.module.css";
import { Check, XOctagon } from "react-feather";
import { toLowerRemoveDiacritics } from "@/helper/string";
import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import { Player, getNewEmptyPlayer } from "@/entities/Player";
import AuthContext from "@/stores/authContext";

export default function CreatePlayer() {
  const [playerCreateEditKey, setPlayerCreateEditKey] = useState(0);
  const [message, setMessage] = useState(<Fragment />);
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());

  const [players, setPlayers] = useState<Player[]>([]);

  const accessToken = useContext(AuthContext)?.accessToken ?? "";

  useEffect(() => {
    async function initPlayers() {
      const tempPlayers = await getAllPlayers();
      setPlayers(tempPlayers);
    }
    initPlayers();
  }, [playerCreateEditKey]);

  // Updates message on component refreshes
  useEffect(() => {
    if (player.name === "" && player.pseudo === "") return;

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
  }, [player, players]);

  const title = <Title>Création d{"'"}un nouveau joueur</Title>;

  async function createPlayer() {
    if (player.name === "") return;

    if (await createNewPlayer(player, accessToken)) {
      setPlayer(getNewEmptyPlayer());

      updateMessage(
        false,
        `Le joueur "${player.name}" enregistré correctement.`
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
