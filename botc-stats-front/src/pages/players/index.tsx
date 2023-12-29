import { GenericTable } from "@/components/table/generic-table/GenericTable";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { getPlayerFullName } from "@/entities/Player";
import { ListboxItem, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function PlayersPage() {
  const { data: players, isLoading } = useGetPlayers();
  const router = useRouter();

  if (isLoading) return <Spinner />;

  return (
    <GenericTable
      columns={[
        { key: "name", name: "Name", allowSorting: true },
        { key: "total", name: "Total", allowSorting: true },
        {
          key: "nbGamesGood",
          name: "Nb parties gentil",
          allowSorting: true,
        },
        {
          key: "nbGamesEvil",
          name: "Nb parties maléfique",
          allowSorting: true,
        },
      ]}
      rows={players.map((player) => ({
        id: "player" + player.id,
        name: getPlayerFullName(player),
        total: player.nbGamesPlayed,
        nbGamesGood: player.nbGamesGood,
        nbGamesEvil: player.nbGamesEvil,
        popoverListboxContent: (
          <ListboxItem
            key={"player-details"}
            aria-label="player-details"
            className="w-full"
            onPress={() => router.push(`/update/players/${player.id}`)}
          >
            Détails de {player.name}
          </ListboxItem>
        ),
        popoverListboxContentStoryTeller: (
          <ListboxItem
            key={"player-update"}
            aria-label="player-update"
            className="w-full"
            onPress={() => router.push(`/update/players/${player.id}`)}
          >
            Modifier le joueur
          </ListboxItem>
        ),
      }))}
    />
  );
}
