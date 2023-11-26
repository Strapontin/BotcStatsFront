import Filter from "@/components/filter/Filter";
import Title from "@/components/ui/title";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Player } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function GamesPlayedByPlayerPage() {
  const [filter, setFilter] = useState<string>("");
  const title = "Nombre de parties/joueur";

  const { data: players, isLoading } = useGetPlayers();

  if (isLoading) {
    return (
      <>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const playersFiltered = players
    .filter(
      (player: Player) =>
        toLowerRemoveDiacritics(player.name).includes(
          toLowerRemoveDiacritics(filter)
        ) ||
        toLowerRemoveDiacritics(player.pseudo).includes(
          toLowerRemoveDiacritics(filter)
        )
    )
    .sort((a: Player, b: Player) => b.nbGamesPlayed - a.nbGamesPlayed);

  return (
    <>
      <Title>{title}</Title>
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre joueur"
      />
      <Listbox items={playersFiltered} aria-label="listbox Players">
        {(player: Player) => (
          <ListboxItem
            key={player.id}
            href={`/players/${player.id}`}
            endContent={player.nbGamesPlayed}
            description={player.pseudo}
            showDivider
            classNames={{
              title: "text-left font-bold",
              description: "w-auto",
            }}
          >
            {player.name}
          </ListboxItem>
        )}
      </Listbox>
    </>
  );
}
