import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { useGetGames } from "@/data/back-api/back-api-game";
import { Game } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";

export default function GamesListPage() {
  const title = "Dernières parties jouées";

  const { data: games, isLoading } = useGetGames();

  if (isLoading) {
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
