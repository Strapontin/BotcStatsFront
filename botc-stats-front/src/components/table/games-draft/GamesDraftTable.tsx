import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { useGetGamesDraft } from "@/data/back-api/back-api-game-draft";
import { GameDraft } from "@/entities/GameDraft";
import { getPlayerFullName } from "@/entities/Player";
import { dateToString, dateToStringYMD } from "@/helper/date";
import { Listbox, Spacer, Spinner } from "@nextui-org/react";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "../generic-table/GenericTable";
import { getListboxItemUpdateGameDraft } from "../generic-table/popover/listbox-items";

type RowType = GenericTableRowsExtendedProps & {
  date: string;
  edition: string;
  storyteller: string;
  notes: string;
};

export function GamesDraftTable() {
  const { data: gamesDraft, isLoading } = useGetGamesDraft();
  const user = useUserHasStoryTellerRights();

  if (isLoading) {
    return <Spinner />;
  }

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "date",
      name: "Date",
      allowSorting: true,
      isFilterable: true,
      isDefaultVisible: true,
      isDefaultSort: true,
    },
    {
      key: "storyteller",
      name: "Conteur",
      allowSorting: true,
      isDefaultVisible: true,
      isFilterable: true,
    },
    {
      key: "edition",
      name: "Module",
      allowSorting: true,
      isDefaultVisible: true,
    },
    {
      key: "notes",
      name: "Notes",
      allowSorting: true,
      isDefaultVisible: true,
    },
  ];

  function tableRowPopover(gameDraft: GameDraft): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemUpdateGameDraft(gameDraft, user.isStoryTeller)}
      </Listbox>
    );
  }

  const tableRows = gamesDraft.map((gameDraft: GameDraft) => {
    const result: RowType = {
      id: "gameDraft" + gameDraft.id,
      date: dateToStringYMD(gameDraft.datePlayed),
      storyteller: getPlayerFullName(gameDraft.storyteller),
      edition: gameDraft.edition.name,
      notes: gameDraft.notes,

      renderJSX: { date: dateToString(gameDraft.datePlayed) },

      popoverContent: user.isStoryTeller ? tableRowPopover(gameDraft) : null,
    };
    return result;
  });

  return (
    <>
      <GenericTable columns={genericTableColumns} rows={tableRows} />
    </>
  );
}
