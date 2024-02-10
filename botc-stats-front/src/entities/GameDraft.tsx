import { dateToString } from "@/helper/date";
import { Edition, getNewEmptyEdition } from "./Edition";
import { Player, getNewEmptyPlayer, getPlayerFullName } from "./Player";

export type GameDraft = {
  id: number;
  edition: Edition;
  storyteller: Player;
  datePlayed: Date;
  notes: string;
};

export function getNewEmptyGameDraft() {
  const game: GameDraft = {
    id: -1,
    edition: getNewEmptyEdition(),
    storyteller: getNewEmptyPlayer(),
    datePlayed: new Date(),
    notes: "",
  };
  return game;
}

export function getGameDraftDisplayName(game: GameDraft): JSX.Element {
  return (
    <>
      {dateToString(game.datePlayed)} - Contée par{" "}
      {getPlayerFullName(game.storyteller)}
    </>
  );
}
