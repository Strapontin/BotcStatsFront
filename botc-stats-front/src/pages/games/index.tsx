import { GamesDraftTable } from "@/components/table/games-draft/GamesDraftTable";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import {
  getListboxItemEditionDetails,
  getListboxItemGameDetails,
  getListboxItemPlayerDetails,
  getListboxItemUpdateGame,
} from "@/components/table/generic-table/popover/listbox-items";
import Title from "@/components/ui/title";
import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { useGetGames } from "@/data/back-api/back-api-game";
import { useGetGamesDraft } from "@/data/back-api/back-api-game-draft";
import { Game } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { alignmentToString } from "@/entities/enums/alignment";
import { dateToString } from "@/helper/date";
import {
  Accordion,
  AccordionItem,
  Button,
  Listbox,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
  const { data: gamesDraft } = useGetGamesDraft();

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
        {getListboxItemGameDetails(game)}
        {getListboxItemPlayerDetails(game.storyteller)}
        {getListboxItemEditionDetails(game.edition)}
        {getListboxItemUpdateGame(game, user.isStoryTeller)}
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
        <div className="flex gap-2">
          <Button
            className="flex-1"
            color="success"
            onPress={() => router.push(`/create/game`)}
          >
            Ajouter une partie
          </Button>
          <Button
            className="flex-1"
            color="success"
            onPress={() => router.push("/create/gamedraft")}
          >
            Ajouter une partie de rappel
          </Button>
        </div>
        <Spacer y={3} />
      </div>
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["games", gamesDraft?.length ? "games-draft" : ""]}
      >
        <AccordionItem
          key="games-draft"
          aria-label="games-draft"
          title="Rappel de parties (pour les conteurs)"
        >
          <GamesDraftTable />
        </AccordionItem>

        <AccordionItem key="games" aria-label="games" title="Parties jouées">
          <GenericTable columns={genericTableColumns} rows={tableRows} />
        </AccordionItem>
      </Accordion>
    </>
  );
}
