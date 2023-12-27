import { GenericTable } from "@/components/table/generic-table/GenericTable";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Spinner } from "@nextui-org/react";

export default function PlayersPage() {
  const { data: players, isLoading } = useGetPlayers();

  if (isLoading) return <Spinner />;

  return (
    <GenericTable
      rows={players.map((player) => [
        {
          column: { key: "name", name: "Name" },
          id: player.id,
          value: player.name,
        },
      ])}
    />
  );
}
