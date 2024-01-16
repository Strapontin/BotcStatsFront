import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import {
  getListboxItemEditionDetails,
  getListboxItemUpdateEdition,
} from "@/components/table/generic-table/popover/listbox-items";
import Title from "@/components/ui/title";
import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { useGetEditions } from "@/data/back-api/back-api-edition";
import { Edition } from "@/entities/Edition";
import { Button, Listbox, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Plus } from "react-feather";

type RowType = GenericTableRowsExtendedProps & {
  name: string;
  total: number | string;
  winsGood: number | string;
  winsEvil: number | string;
};

export default function UpdateEditionsPage() {
  const { data: editions, isLoading } = useGetEditions();
  const router = useRouter();
  const user = useUserHasStoryTellerRights();

  const title = <Title>Liste des modules</Title>;

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
      isDefaultVisible: true,
      isDefaultSort: true,
    },
    {
      key: "winsGood",
      name: "Victoires des gentils",
      allowSorting: true,
      isDefaultVisible: true,
    },
    { key: "winsEvil", name: "Victoires des maléfiques", allowSorting: true },
  ];

  function tableRowPopover(edition: Edition): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemEditionDetails(edition)}
        {getListboxItemUpdateEdition(
          edition,
          !user.isStoryTeller ? "hidden" : ""
        )}
      </Listbox>
    );
  }

  const tableRows = editions.map((edition: Edition) => {
    const result: RowType = {
      id: "edition" + edition.id,
      name: edition.name,
      total: edition.timesPlayed,

      winsGood: edition.timesGoodWon,
      winsEvil: edition.timesEvilWon,

      popoverContent: tableRowPopover(edition),
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

  const tableRowsPercentage = tableRows.map((edition: RowType) => {
    const result: RowType = {
      ...edition,
      total: edition.total,

      winsGood: computePercentage(edition.total, edition.winsGood),
      winsEvil: computePercentage(edition.total, edition.winsEvil),
    };
    return result;
  });

  return (
    <>
      {title}
      <Spacer y={1} />
      <div className={user.isStoryTeller ? "" : "hidden"}>
        <Button
          className="flex"
          color="success"
          startContent={<Plus className="h-4" />}
          onPress={() => router.push(`/create/edition`)}
        >
          Ajouter un nouveau module
        </Button>
      </div>
      <Spacer y={3} />
      <GenericTable
        columns={genericTableColumns}
        rows={tableRows}
        rowsPercentage={tableRowsPercentage}
      />
    </>
  );
}
