import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import { useGetUpdateHistory } from "@/data/back-api/back-api-update-history";
import { UpdateHistory } from "@/entities/UpdateHistory";
import { dateTimeToString } from "@/helper/date";
import { Spinner, Tab, Tabs } from "@nextui-org/react";
import NotFoundPage from "../404";

type RowType = GenericTableRowsExtendedProps & {
  id: number;
  date: string;
  text: string;

  playerId?: number;
  roleId?: number;
  editionId?: number;
  gameId?: number;
};

export default function HistoryPage() {
  const { data: updateHistory, isLoading } = useGetUpdateHistory();

  if (isLoading) {
    return <Spinner />;
  } else if (!updateHistory) {
    return <NotFoundPage />;
  }

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "id",
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
      reverseDefaultSort: true,
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
      id: uh.id,

      date: dateTimeToString(uh.date),
      text: uh.text,

      playerId: uh.playerId,
      roleId: uh.roleId,
      editionId: uh.editionId,
      gameId: uh.gameId,

      renderJSX: {
        text: (
          <div className="flex text-left whitespace-break-spaces">
            {uh.text}
          </div>
        ),
      },
    };
    return result;
  });

  return (
    <Tabs aria-label="tabs">
      <Tab key="players" title="Joueurs">
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter((tr: RowType) => tr.playerId)
            .map((tr: RowType) => {
              tr.id = tr.playerId!;
              return tr;
            })}
        />
      </Tab>
      <Tab key="roles" title="Rôles">
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter((tr: RowType) => tr.roleId)
            .map((tr: RowType) => {
              tr.id = tr.roleId!;
              return tr;
            })}
        />
      </Tab>
      <Tab key="editions" title="Modules">
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter((tr: RowType) => tr.editionId)
            .map((tr: RowType) => {
              tr.id = tr.editionId!;
              return tr;
            })}
        />
      </Tab>
      <Tab key="games" title="Parties">
        <GenericTable
          columns={genericTableColumns}
          rows={tableRows
            .filter((tr: RowType) => tr.gameId)
            .map((tr: RowType) => {
              tr.id = tr.gameId!;
              return tr;
            })}
        />
      </Tab>
    </Tabs>
  );
}
