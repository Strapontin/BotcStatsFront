import PlayerName from "@/components/ui/playerName";
import { dateToString } from "@/helper/date";
import { Edition, getNewEmptyEdition } from "./Edition";
import { Player, getNewEmptyPlayer, getPlayerPseudoString } from "./Player";
import { PlayerRole } from "./PlayerRole";
import { Role } from "./Role";
import { Alignment } from "./enums/alignment";

export type Game = {
  id: number;
  edition: Edition;
  storyTeller: Player;
  datePlayed: Date;
  notes: string;
  winningAlignment: Alignment;

  playerRoles: PlayerRole[];
  demonBluffs: Role[];
};

export function getNewEmptyGame() {
  const game: Game = {
    id: -1,
    edition: getNewEmptyEdition(),
    storyTeller: getNewEmptyPlayer(),
    datePlayed: new Date(),
    notes: "",
    winningAlignment: Alignment.None,
    playerRoles: [],
    demonBluffs: [],
  };
  return game;
}

export function getGameDisplayName(game: Game): JSX.Element {
  return (
    <>
      {dateToString(game.datePlayed)} - Contée par{" "}
      {
        <PlayerName
          name={`${game.storyTeller.name}${getPlayerPseudoString(
            game.storyTeller.pseudo
          )}`}
        />
      }
    </>
  );
}
