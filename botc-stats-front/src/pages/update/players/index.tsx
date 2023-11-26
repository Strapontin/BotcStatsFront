import Filter from "@/components/filter/Filter";
import Title from "@/components/ui/title";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Player } from "@/entities/Player";
import { stringContainsString } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function UpdatePlayersPage() {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Modifier un joueur</Title>;

  const { data: players, isLoading } = useGetPlayers();

  if (isLoading) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const playersFiltered = players.filter(
    (player: Player) =>
      stringContainsString(player.name, filter) ||
      stringContainsString(player.pseudo, filter)
  );

  return (
    <>
      {title}
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre joueur"
      />
      <Listbox items={playersFiltered}>
        {(player: Player) => (
          <ListboxItem
            key={player.id}
            href={`/update/players/${player.id}`}
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
