import Filter from "@/components/filter/Filter";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import { useGetUpdateHistory } from "@/data/back-api/back-api-update-history";
import { UpdateHistory } from "@/entities/UpdateHistory";
import { dateTimeToString } from "@/helper/date";
import { Spacer, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useMemo, useState } from "react";
import NotFoundPage from "../404";

type RowType = GenericTableRowsExtendedProps & {
  key: number;
  date: string;
  text: string;

  playerId?: number;
  roleId?: number;
  editionId?: number;
  gameId?: number;
};

export default function HistoryPage() {
  const { data: updateHistory, isLoading } = useGetUpdateHistory();
  const [filter, setFilter] = useState<string>("");

  const filterId = useMemo(() => {
    return (
      <Filter
        filterValue={filter}
        placeholder="Filtrer sur l'id"
        setFilter={setFilter}
      />
    );
  }, [filter]);

  if (isLoading) {
    return <Spinner />;
  } else if (!updateHistory) {
    return <NotFoundPage />;
  }

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "key",
      name: "Id",
      allowSorting: true,
      isDefaultVisible: true,
    },
    {
      key: "date",
      name: "Date",
      allowSorting: true,
      isDefaultVisible: true,
      isDefaultSort: true,
    },
    {
      key: "text",
      name: "Texte",
      allowSorting: true,
      isDefaultVisible: true,
    },
  ];

  const tableRows = updateHistory.map((uh: UpdateHistory) => {
    const result: RowType = {
      id: "uh" + uh.id,
      key: uh.id,

      date: dateTimeToString(uh.date),
      text: uh.text,

      playerId: uh.playerId,
      roleId: uh.roleId,
      editionId: uh.editionId,
      gameId: uh.gameId,

      renderJSX: {
        text: (
          <span className="flex text-left whitespace-break-spaces">
            {uh.text}
          </span>
        ),
      },
    };
    return result;
  });

  return (
    <Tabs aria-label="tabs">
      <Tab key="players" title="Joueurs">
        {filterId}
        <Spacer y={2.5} />
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter(
              (tr: RowType) =>
                (tr.playerId && filter === "") ||
                (!isNaN(Number(filter)) && Number(filter) === tr.playerId)
            )
            .map((tr: RowType) => {
              tr.key = tr.playerId!;
              return tr;
            })}
        />
      </Tab>
      <Tab key="roles" title="Rôles">
        {filterId}
        <Spacer y={2.5} />
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter(
              (tr: RowType) =>
                (tr.roleId && filter === "") ||
                (!isNaN(Number(filter)) && Number(filter) === tr.roleId)
            )
            .map((tr: RowType) => {
              tr.key = tr.roleId!;
              return tr;
            })}
        />
      </Tab>
      <Tab key="editions" title="Modules">
        {filterId}
        <Spacer y={2.5} />
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter(
              (tr: RowType) =>
                (tr.editionId && filter === "") ||
                (!isNaN(Number(filter)) && Number(filter) === tr.editionId)
            )
            .map((tr: RowType) => {
              tr.key = tr.editionId!;
              return tr;
            })}
        />
      </Tab>
      <Tab key="games" title="Parties">
        {filterId}
        <Spacer y={2.5} />
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter(
              (tr: RowType) =>
                (tr.gameId && filter === "") ||
                (!isNaN(Number(filter)) && Number(filter) === tr.gameId)
            )
            .map((tr: RowType) => {
              tr.key = tr.gameId!;
              return tr;
            })}
        />
      </Tab>
    </Tabs>
  );
}
