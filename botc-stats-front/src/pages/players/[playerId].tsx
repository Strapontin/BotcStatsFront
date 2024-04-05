import { PlayerRolesTable } from "@/components/table/player-roles/PlayerRolesTable";
import Title from "@/components/ui/title";
import {
  useGetGamesByPlayerId,
  useGetGamesByStorytellerId,
} from "@/data/back-api/back-api-game";
import { useGetPlayerById } from "@/data/back-api/back-api-player";
import { Game, getGameDisplayName } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import NotFoundPage from "../404";

export default function PlayerPage() {
  const classNamesListBoxItem = useMemo(() => {
    return { title: "text-left font-bold" };
  }, []);

  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const { data: player, isLoading } = useGetPlayerById(playerId);
  const { data: gamesPlayed, isLoading: isLoadingGamesPlayed } =
    useGetGamesByPlayerId(playerId);
  const { data: gamesStorytelled } = useGetGamesByStorytellerId(playerId);

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (!player) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = <Title>Détails {getPlayerFullName(player)}</Title>;

  const accordionItems: {
    key: string;
    title: string;
    children: JSX.Element;
  }[] = [
    {
      key: "main-details",
      title: "Détails généraux",
      children: (
        <Listbox aria-label="Détails généraux" variant="light">
          <ListboxItem
            key={1}
            endContent={player.nbGamesPlayed}
            classNames={classNamesListBoxItem}
            showDivider
          >
            Parties jouées
          </ListboxItem>
          <ListboxItem
            key={2}
            endContent={`${player.nbGamesGood} | ${player.nbGamesEvil}`}
            classNames={classNamesListBoxItem}
            showDivider
          >
            Gentil | Maléfique
          </ListboxItem>
          <ListboxItem
            key={3}
            endContent={`${player.nbGamesWon} | ${player.nbGamesLost}`}
            classNames={classNamesListBoxItem}
          >
            Victoires | Défaites
          </ListboxItem>
        </Listbox>
      ),
    },
    {
      key: "table-roles-played",
      title: "Détails des rôles joués",
      children: <PlayerRolesTable playerRoles={player.timesPlayedRole} />,
    },
  ];

  if (gamesPlayed) {
    accordionItems.push({
      key: "games-played",
      title: "Parties jouées",
      children: (
        <Listbox
          className="text-left"
          aria-label="Parties jouées"
          variant="light"
        >
          {gamesPlayed.map((game: Game) => {
            const playerRole = game.playerRoles.find(
              (pr) => pr?.player?.id === player.id
            )!;

            return (
              <ListboxItem
                key={`game-${game.id}`}
                className="text-left"
                textValue={String(game.id)}
                showDivider
              >
                <Link
                  className="flex flex-col leading-none"
                  href={`/games/${game.id}`}
                >
                  <span>{getGameDisplayName(game)}</span>
                  <span className="text-slate-600 text-xs">
                    {game.winningAlignment === playerRole.finalAlignment
                      ? "Victoire - "
                      : "Défaite - "}
                    Rôle joué : {playerRole?.role?.name}
                  </span>
                </Link>
              </ListboxItem>
            );
          })}
        </Listbox>
      ),
    });
  }

  if (gamesStorytelled?.length) {
    accordionItems.push({
      key: "games-storytelled",
      title: "Parties contées",
      children: (
        <Listbox
          className="text-left"
          aria-label="Parties contées"
          variant="light"
        >
          {gamesStorytelled.map((game: Game) => (
            <ListboxItem
              key={`game-${game.id}`}
              className="text-left"
              textValue={String(game.id)}
              showDivider
            >
              <Link href={`/games/${game.id}`}>
                {dateToString(game.datePlayed)} -{" "}
                {game.playerRoles?.length.toLocaleString("fr-FR", {
                  minimumIntegerDigits: 2,
                })}{" "}
                joueurs - {game.edition?.name}
              </Link>
            </ListboxItem>
          ))}
        </Listbox>
      ),
    });
  }

  return (
    <>
      {title}
      <Accordion
        selectionMode={"multiple"}
        defaultExpandedKeys={["main-details", "table-roles-played"]}
      >
        {accordionItems.map((item) => (
          <AccordionItem
            key={item.key}
            aria-label={item.title}
            title={item.title}
          >
            {item.children}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
