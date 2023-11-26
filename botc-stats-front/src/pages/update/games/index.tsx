import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { Game } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllGames } from "../../../../data/back-api/back-api";

export default function UpdateGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const title = <Title>Modifier une partie</Title>;

  useEffect(() => {
    getAllGames().then((g) => {
      setGames(g);
    });
  }, []);

  if (games.length === 0) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  return (
    <>
      {title}
      <Spacer y={5} />
      <Listbox aria-label="Parties jouées">
        {games.map((game: Game) => (
          <ListboxItem
            key={game.id}
            className="text-left"
            href={`/update/games/${game.id}`}
            textValue={String(game.id)}
            showDivider
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
