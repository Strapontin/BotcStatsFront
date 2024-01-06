import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import {
  getListboxItemEditionDetails,
  getListboxItemGameDetails,
  getListboxItemPlayerDetails,
} from "@/components/table/generic-table/popover/listbox-items";
import Title from "@/components/ui/title";
import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { useGetGames } from "@/data/back-api/back-api-game";
import { Game } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { alignmentToString } from "@/entities/enums/alignment";
import { dateToString } from "@/helper/date";
import {
  Button,
  Listbox,
  ListboxItem,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { Plus } from "react-feather";

type RowType = GenericTableRowsExtendedProps & {
  datePlayed: Date | string;
  storyteller: string;
  edition: string;
  nbPlayers: number;
  winningAlignment: string;
};

export default function GamesListPage() {
  const { data: games, isLoading } = useGetGames();
  const router = useRouter();
  const user = useUserHasStoryTellerRights();

  const title = <Title>Dernières parties jouées</Title>;

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
      key: "datePlayed",
      name: "Date de la partie",
      allowSorting: true,
      isDefaultVisible: true,
      isDefaultSort: true,
    },
    {
      key: "storyteller",
      name: "Conteur",
      isFilterable: true,
      allowSorting: true,
      isDefaultVisible: true,
    },
    {
      key: "edition",
      name: "Module",
      isFilterable: true,
      allowSorting: true,
      isDefaultVisible: true,
    },
    { key: "nbPlayers", name: "Nb joueurs", allowSorting: true },
    { key: "winningAlignment", name: "Alignement gagnant", allowSorting: true },
  ];

  function tableRowPopover(game: Game): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemGameDetails(game, router)}
        {getListboxItemPlayerDetails(game.storyteller, router)}
        {getListboxItemEditionDetails(game.edition, router)}

        <ListboxItem
          key={"game-update"}
          aria-label="game-update"
          className={`w-full ${!user.isStoryTeller ? "hidden" : ""}`}
          onPress={() => router.push(`/update/games/${game.id}`)}
        >
          Modifier la partie
        </ListboxItem>
      </Listbox>
    );
  }

  const tableRows = games.map((game: Game) => {
    const result: RowType = {
      id: "game" + game.id,

      datePlayed: game.datePlayed,
      storyteller: getPlayerFullName(game.storyteller),
      edition: game.edition.name,
      nbPlayers: game.playerRoles.length,
      winningAlignment: alignmentToString(game.winningAlignment),

      renderJSX: { datePlayed: dateToString(new Date(game.datePlayed)) },

      popoverContent: tableRowPopover(game),
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
          onPress={() => router.push(`/create/game`)}
        >
          Ajouter une nouvelle partie
        </Button>
        <Spacer y={3} />
      </div>
      <GenericTable columns={genericTableColumns} rows={tableRows} />
    </>
  );
}
