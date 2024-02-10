import { Edition, getNewEmptyEdition } from "./Edition";
import { Player, getNewEmptyPlayer } from "./Player";

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
