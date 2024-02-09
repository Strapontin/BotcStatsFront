import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import {
  getListboxItemPlayerDetails,
  getListboxItemUpdatePlayer,
} from "@/components/table/generic-table/popover/listbox-items";
import Title from "@/components/ui/title";
import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Player, getPlayerFullName } from "@/entities/Player";
import { Button, Listbox, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Plus } from "react-feather";

type RowType = GenericTableRowsExtendedProps & {
  name: string;
  total: number | string;
  wins: number | string;
  loses: number | string;
  gamesGood: number | string;
  gamesEvil: number | string;
  winsGood: number | string;
  winsEvil: number | string;
};

export default function PlayersPage() {
  const { data: players, isLoading } = useGetPlayers();
  const router = useRouter();
  const user = useUserHasStoryTellerRights();

  const title = <Title>Liste des joueurs</Title>;

  if (isLoading) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "name",
      name: "Nom",
      allowSorting: true,
      isFilterable: true,
      isDefaultVisible: true,
    },
    {
      key: "total",
      name: "Total",
      allowSorting: true,
      isDefaultSort: true,
      isDefaultVisible: true,
    },
    { key: "wins", name: "Victoires", allowSorting: true },
    { key: "loses", name: "Défaites", allowSorting: true },
    {
      key: "gamesGood",
      name: "Parties gentil",
      allowSorting: true,
      isDefaultVisible: true,
    },
    {
      key: "gamesEvil",
      name: "Parties maléfique",
      allowSorting: true,
    },
    { key: "winsGood", name: "Victoires gentil", allowSorting: true },
    { key: "winsEvil", name: "Victoires maléfique", allowSorting: true },
  ];

  function tableRowPopover(player: Player): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemPlayerDetails(player)}
        {getListboxItemUpdatePlayer(player, user.isStoryTeller)}
      </Listbox>
    );
  }

  const tableRows = players.map((player: Player) => {
    const result: RowType = {
      id: "player" + player.id,
      name: getPlayerFullName(player),
      total: player.nbGamesPlayed,

      wins: player.nbGamesWon,
      loses: player.nbGamesLost,

      gamesGood: player.nbGamesGood,
      gamesEvil: player.nbGamesEvil,

      winsGood: player.nbGamesGoodWon,
      winsEvil: player.nbGamesEvilWon,

      popoverContent: tableRowPopover(player),
    };
    return result;
  });

  function computePercentage(
    total: number | string,
    value: number | string
  ): string {
    if (typeof total === "string" || typeof value === "string") return "-";
    return total === 0
      ? "-"
      : ((value / total) * 100).toFixed() + `% (${value})`;
  }

  const tableRowsPercentage = tableRows.map((player) => {
    const result: RowType = {
      ...player,
      total: player.total,
      wins: computePercentage(player.total, player.wins),
      loses: computePercentage(player.total, player.loses),

      gamesGood: computePercentage(player.total, player.gamesGood),
      gamesEvil: computePercentage(player.total, player.gamesEvil),

      winsGood: computePercentage(player.gamesGood, player.winsGood),
      winsEvil: computePercentage(player.gamesEvil, player.winsEvil),
    };
    return result;
  });

  return (
    <>
      {title}
      <div className={user.isStoryTeller ? "" : "hidden"}>
        <Button
          className="flex"
          color="success"
          startContent={<Plus className="h-4" />}
          onPress={() => router.push(`/create/player`)}
        >
          Ajouter un nouveau joueur
        </Button>
        <Spacer y={3} />
      </div>
      <GenericTable
        columns={genericTableColumns}
        rows={tableRows}
        rowsPercentage={tableRowsPercentage}
      />
    </>
  );
}
