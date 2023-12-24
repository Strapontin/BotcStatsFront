import Title from "@/components/ui/title";
import { useGetGames } from "@/data/back-api/back-api-game";
import { Game, getGameDisplayName } from "@/entities/Game";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";

export default function UpdateGamesPage() {
  const title = <Title>Modifier une partie</Title>;

  const { data: games, isLoading } = useGetGames();

  if (isLoading) {
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
      <Listbox aria-label="Parties jouées">
        {games.map((game: Game) => (
          <ListboxItem
            key={game.id}
            className="text-left"
            href={`/update/games/${game.id}`}
            textValue={String(game.id)}
            showDivider
          >
            {getGameDisplayName(game)}
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
