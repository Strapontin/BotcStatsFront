import { PlayerRolesTable } from "@/components/table/player-roles/PlayerRolesTable";
import Title from "@/components/ui/title";
import {
  useGetGamesByPlayerId,
  useGetGamesByStorytellerId,
} from "@/data/back-api/back-api-game";
import { useGetPlayerById } from "@/data/back-api/back-api-player";
import { Game, getGameDisplayName } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
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
  const { data: gamesStorytelled, isLoading: isLoadingGamesStorytelled } =
    useGetGamesByStorytellerId(playerId);

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

  const title = (
    <Title>
      Détails {player.name}
      {getPlayerPseudoString(player.pseudo)}
    </Title>
  );

  const playerComponent = player ? (
    <AccordionItem
      key="main-details"
      aria-label="Détails généraux"
      title="Détails généraux"
    >
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
    </AccordionItem>
  ) : (
    <></>
  );

  const detailsRolesPlayed = (
    <AccordionItem
      key="table-roles-played"
      aria-label="Détails des rôles joués"
      title="Détails des rôles joués"
    >
      <PlayerRolesTable playerRoles={player?.timesPlayedRole} />
    </AccordionItem>
  );

  const listGamesPlayed = (
    <AccordionItem
      key="games-played"
      aria-label="Parties jouées"
      title="Parties jouées"
    >
      {isLoadingGamesPlayed && <Spinner />}
      {!isLoadingGamesPlayed && gamesPlayed && (
        <Listbox
          className="text-left"
          aria-label="Parties jouées"
          variant="light"
        >
          {gamesPlayed.map((game: Game) => (
            <ListboxItem
              key={`game-${game.id}`}
              className="text-left"
              href={`/games/${game.id}`}
              textValue={String(game.id)}
              showDivider
            >
              {getGameDisplayName(game)}
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </AccordionItem>
  );

  const listGamesStorytelled = (
    <AccordionItem
      key="games-storytelled"
      aria-label="Parties contées"
      title="Parties contées"
    >
      <Listbox
        className="text-left"
        aria-label="Parties contées"
        variant="light"
      >
        {gamesStorytelled ? (
          gamesStorytelled.map((game: Game) => (
            <ListboxItem
              key={`game-${game.id}`}
              className="text-left"
              href={`/games/${game.id}`}
              textValue={String(game.id)}
              showDivider
            >
              <div>
                {dateToString(game.datePlayed)} -{" "}
                {game.playerRoles?.length.toLocaleString("fr-FR", {
                  minimumIntegerDigits: 2,
                })}{" "}
                joueurs - {game.edition?.name}
              </div>
            </ListboxItem>
          ))
        ) : (
          <></>
        )}
      </Listbox>
    </AccordionItem>
  );

  return (
    <>
      {title}
      <Accordion
        selectionMode={"multiple"}
        defaultExpandedKeys={["main-details", "table-roles-played"]}
      >
        {playerComponent}
        {detailsRolesPlayed}
        {listGamesPlayed}
        {(gamesStorytelled?.length && listGamesStorytelled) as JSX.Element}
      </Accordion>
    </>
  );
}
