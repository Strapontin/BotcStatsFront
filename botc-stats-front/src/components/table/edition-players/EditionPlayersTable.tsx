import { PlayersWhoPlayedEdition } from "@/entities/Edition";
import { getPlayerFullName } from "@/entities/Player";
import { Listbox, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "../generic-table/GenericTable";
import { getListboxItemPlayerDetails } from "../generic-table/popover/listbox-items";

type RowType = GenericTableRowsExtendedProps & {
  name: string;
  total: number | string;
  wins: number | string;
  loses: number | string;
};

export function EditionPlayersTable({
  playersWhoPlayedEdition,
}: {
  playersWhoPlayedEdition: PlayersWhoPlayedEdition[];
}) {
  const router = useRouter();

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
    {
      key: "wins",
      name: "Victoires",
      allowSorting: true,
      isDefaultVisible: true,
    },
    { key: "loses", name: "Défaites", allowSorting: true },
  ];

  function tableRowPopover(pwpe: PlayersWhoPlayedEdition): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemPlayerDetails(pwpe.player, router)}
      </Listbox>
    );
  }

  const tableRows = playersWhoPlayedEdition.map(
    (pwpe: PlayersWhoPlayedEdition) => {
      const result: RowType = {
        id: "pwpe" + pwpe.player.id,
        name: getPlayerFullName(pwpe.player),
        total: pwpe.timesPlayedEdition,

        wins: pwpe.timesWon,
        loses: pwpe.timesLost,

        popoverContent: tableRowPopover(pwpe),
      };
      return result;
    }
  );

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
    };
    return result;
  });

  return (
    <>
      <Spacer y={3} />
      <GenericTable
        columns={genericTableColumns}
        rows={tableRows}
        rowsPercentage={tableRowsPercentage}
      />
    </>
  );
}
