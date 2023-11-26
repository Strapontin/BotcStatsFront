import ListItem from "@/components/list-stats/ListItem";
import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { Game } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import { Link, Spinner, Spacer, Listbox, ListboxItem } from "@nextui-org/react";
import { getAllGames } from "../../../data/back-api/back-api";
import { useEffect, useState } from "react";

export default function GamesListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const title = "Dernières parties jouées";

  useEffect(() => {
    getAllGames().then((g) => {
      setGames(g);
    });
  }, []);

  if (games.length === 0) {
    return (
      <>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Title>{title}</Title>
      <Spacer y={5} />
      <Listbox aria-label="Parties jouées">
        {games.map((game: Game) => (
          <ListboxItem
            key={game.id}
            className="text-left"
            href={`/games/${game.id}`}
            textValue={String(game.id)}
          >
            {dateToString(game.datePlayed)} - Contée par{" "}
            {
              <PlayerName
                name={`${game.storyTeller.name}${getPlayerPseudoString(
                  game.storyTeller.pseudo
                )}`}
              />
            }
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
