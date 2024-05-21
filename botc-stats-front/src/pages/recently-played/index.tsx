import AutocompletePlayer from "@/components/autocompletes/AutocompletePlayer";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import { getUserRole } from "@/components/ui/image-role-name";
import { useGetRoleHistory } from "@/data/back-api/back-api-player";
import { Player, getPlayerFullName } from "@/entities/Player";
import { RoleHistory } from "@/entities/RoleHistory";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

type RowType = GenericTableRowsExtendedProps & {
  addedOrder: number;
  name: string;
};

export default function RecentlyPlayedPage() {
  const maxRolesShown = 10;

  const [playersSelected, setPlayersSelected] = useState<Player[]>([]);
  const [historyTable, setHistoryTable] = useState<RoleHistory[]>([]);

  const { data: playersHistories, isLoading } = useGetRoleHistory(
    playersSelected.map((p) => p.id),
    maxRolesShown
  );

  useEffect(() => {
    if (historyTable.length && !playersSelected.length)
      return setHistoryTable([]);

    if (playersHistories) {
      setHistoryTable(playersHistories);
    } else {
      const missingPlayer = playersSelected.filter(
        (p) => !historyTable.some((ht) => p.id == ht.playerId)
      )[0];

      if (!missingPlayer) return;

      const newRoleHistory: RoleHistory = {
        playerId: missingPlayer.id,
        name: missingPlayer.name,
        pseudo: missingPlayer.pseudo,
      };

      setHistoryTable((prev) => [...prev, newRoleHistory]);
    }
  }, [playersHistories, historyTable, playersSelected]);

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "addedOrder",
      name: "Ordre d'ajout des éléments",
      allowSorting: true,
      isDefaultSort: true,
      reverseDefaultSort: true,
    },
    {
      key: "name",
      name: "Nom du joueur",
      allowSorting: true,
      isDefaultVisible: true,
    },
  ];

  // Adds 10 columns for each previous games
  for (let i = 1; i <= maxRolesShown; i++) {
    const column: GenericTableColumnProps = {
      key: `game-${i}`,
      name: `game-${i}`,
      isDefaultVisible: true,
    };

    genericTableColumns.push(column);
  }

  function tableRowPopover(playerHistory: RoleHistory): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        <ListboxItem
          key={1}
          onClick={() => {
            setPlayersSelected((prev) =>
              prev.filter((p) => p.id !== playerHistory.playerId)
            );
          }}
        >
          Supprimer la ligne du tableau
        </ListboxItem>
      </Listbox>
    );
  }

  const tableRows = historyTable
    ? historyTable.map((playerHistory: RoleHistory) => {
        const result: RowType = {
          id: playerHistory.playerId,
          addedOrder: playersSelected.findIndex(
            (p) => p.id === playerHistory.playerId
          ),
          name: getPlayerFullName(playerHistory),

          renderJSX: {},
          popoverContent: tableRowPopover(playerHistory),
        };

        if (!playerHistory.roleHistories) {
          return result;
        }

        for (let i = 0; i < maxRolesShown; i++) {
          if (!playerHistory?.roleHistories[i]?.role) continue;

          const id = `game-${i + 1}` as keyof GenericTableRowsExtendedProps;
          result[id] = playerHistory?.roleHistories[i].role.name;
          result.renderJSX[id] = getUserRole(
            playerHistory?.roleHistories[i].role
          );
        }

        return result;
      })
    : [];

  // Component to add a player
  const AddPlayer = () => {
    return (
      <AutocompletePlayer
        playersIdToHide={playersSelected.map((p) => p.id)}
        setSelectedPlayer={(player) => {
          setPlayersSelected((prev) => [...prev, player]);
        }}
        autocompleteLabel="Ajouter un joueur"
      />
    );
  };

  if (!historyTable?.length && isLoading) {
    return <Spinner />;
  }

  if (!historyTable?.length) {
    return <AddPlayer />;
  }

  return (
    <div>
      <GenericTable columns={genericTableColumns} rows={tableRows} />

      <Spacer y={10} />

      <AddPlayer />
    </div>
  );
}
