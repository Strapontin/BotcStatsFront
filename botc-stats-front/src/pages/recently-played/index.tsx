import AutocompletePlayer from "@/components/autocompletes/AutocompletePlayer";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import { useGetPlayerById } from "@/data/back-api/back-api-player";
import { Player, getPlayerFullName } from "@/entities/Player";
import { useState } from "react";

type RowType = GenericTableRowsExtendedProps & {
  name: string;
};

export default function RecentlyPlayedPage() {
  console.log("playersSelected");
  const foo: Player = {
    id: 1,
    name: "string",
    pseudo: "string",
    nbGamesPlayed: 1,
    nbGamesWon: 1,
    nbGamesLost: 1,
    nbGamesGood: 1,
    nbGamesEvil: 1,
    nbGamesGoodWon: 1,
    nbGamesEvilWon: 1,
    timesPlayedRole: [],
  };
  const [playersSelected, setPlayersSelected] = useState<Player[]>([foo]);
  console.log(playersSelected);

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "name",
      name: "Nom du joueur",
      allowSorting: true,
      isDefaultVisible: true,
    },
  ];

  const tableRows = playersSelected.map((player: Player) => {
    const result: RowType = {
      id: player.id,
      name: getPlayerFullName(player),
    };
    return result;
  });

  const AddPlayer = () => {
    return (
      <AutocompletePlayer
        setSelectedPlayer={(player) => {
          if (playersSelected.filter((p) => p.id === player.id).length === 0)
            setPlayersSelected((prev) => [...prev, player]);
        }}
      ></AutocompletePlayer>
    );
  };

  if (!playersSelected.length) {
    return <AddPlayer />;
  }

  return (
    <div>
      <GenericTable columns={genericTableColumns} rows={tableRows} />

      <AddPlayer />
    </div>
  );
}
