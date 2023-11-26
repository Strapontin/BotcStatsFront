import Filter from "@/components/filter/Filter";
import Title from "@/components/ui/title";
import { Player } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllPlayers } from "../../../data/back-api/back-api";

export default function GamesPlayedByPlayerPage() {
  const [filter, setFilter] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const title = "Nombre de parties/joueur";

  useEffect(() => {
    getAllPlayers().then((p) => {
      const sortedPlayers = p.sort(
        (a: Player, b: Player) => b.nbGamesPlayed - a.nbGamesPlayed
      );
      setPlayers(sortedPlayers);
    });
  }, []);

  if (players.length === 0) {
    return (
      <>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const playersFiltered = players.filter(
    (player) =>
      toLowerRemoveDiacritics(player.name).includes(
        toLowerRemoveDiacritics(filter)
      ) ||
      toLowerRemoveDiacritics(player.pseudo).includes(
        toLowerRemoveDiacritics(filter)
      )
  );

  return (
    <>
      <Title>{title}</Title>
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre joueur"
      />
      <Listbox items={playersFiltered}>
        {(player) => (
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
