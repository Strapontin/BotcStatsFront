import {
  GenericTable,
  GenericTableColumnProps,
} from "@/components/table/generic-table/GenericTable";
import Title from "@/components/ui/title";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Player, getPlayerFullName } from "@/entities/Player";
import AuthContext from "@/stores/authContext";
import {
  Button,
  Listbox,
  ListboxItem,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Plus } from "react-feather";

export default function PlayersPage() {
  const { data: players, isLoading } = useGetPlayers();
  const router = useRouter();
  const user = useContext(AuthContext);

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
    { key: "name", name: "Name", allowSorting: true },
    {
      key: "total",
      name: "Total",
      allowSorting: true,
      defaultFilter: true,
    },
    { key: "wins", name: "Victoires", allowSorting: true },
    { key: "loses", name: "Défaites", allowSorting: true },
    {
      key: "gamesGood",
      name: "Parties gentil",
      allowSorting: true,
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
        <ListboxItem
          key={"player-details"}
          aria-label="player-details"
          className="w-full"
          onPress={() => router.push(`/players/${player.id}`)}
        >
          Détails de '{getPlayerFullName(player)}'
        </ListboxItem>
        <ListboxItem
          key={"player-update"}
          aria-label="player-update"
          className={`w-full ${!user.isStoryTeller ? "hidden" : ""}`}
          onPress={() => router.push(`/update/players/${player.id}`)}
        >
          Modifier '{getPlayerFullName(player)}'
        </ListboxItem>
      </Listbox>
    );
  }

  const tableRows = players.map((player) => ({
    id: "player" + player.id,
    name: getPlayerFullName(player),
    total: player.nbGamesPlayed,

    wins: -1, //TODO : fetch values in backend
    loses: -1,

    gamesGood: player.nbGamesGood,
    gamesEvil: player.nbGamesEvil,

    winsGood: -1,
    winsEvil: -1,

    popoverContent: tableRowPopover(player),
  }));

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
      <GenericTable columns={genericTableColumns} rows={tableRows} />
    </>
  );
}
