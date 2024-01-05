import { RolePlayersTable } from "@/components/table/role-players/RolePlayersTable";
import { getRoleIconPath } from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useGetGamesByRoleId } from "@/data/back-api/back-api-game";
import { useGetRoleById } from "@/data/back-api/back-api-role";
import { Game, getGameDisplayName } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { Role } from "@/entities/Role";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo } from "react";
import NotFoundPage from "../404";

export default function RoleIdPage() {
  const classNamesListBoxItem = useMemo(() => {
    return { title: "text-left font-bold" };
  }, []);

  const router = useRouter();
  const roleId: number = Number(router.query.roleId);

  const { data: role, isLoading }: { data: Role; isLoading: boolean } =
    useGetRoleById(roleId);
  const { data: gamesPlayed, isLoading: isLoadingGamesPlayed } =
    useGetGamesByRoleId(roleId);

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (!role) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = (
    <>
      <Title>
        Détails {role.name}
        <div className="flex justify-center">
          <Image
            priority
            src={getRoleIconPath(role.name)}
            alt={getRoleIconPath(role.name)}
            width={150}
            height={150}
          ></Image>
        </div>
      </Title>
    </>
  );

  const roleComponent = role ? (
    <AccordionItem
      key="main-details"
      aria-label="Détails généraux"
      title="Détails généraux"
    >
      <Listbox aria-label="Détails généraux" variant="light">
        <ListboxItem
          key={1}
          endContent={role.timesPlayedTotal}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Parties jouées
        </ListboxItem>
        <ListboxItem
          key={3}
          endContent={`${role.timesWonTotal} | ${role.timesLostTotal}`}
          classNames={classNamesListBoxItem}
        >
          Victoires | Défaites
        </ListboxItem>
      </Listbox>
    </AccordionItem>
  ) : (
    <></>
  );

  const detailsPlayersPlayedThisRole = role?.playersWhoPlayedRole ? (
    <AccordionItem
      key="table-players-who-played-role"
      aria-label="Détails des joueurs de ce rôle"
      title="Détails des joueurs de ce rôle"
    >
      <RolePlayersTable playersWhoPlayedRole={role?.playersWhoPlayedRole} />
    </AccordionItem>
  ) : (
    <></>
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
          {gamesPlayed.map((game: Game) => {
            const playerRole = game.playerRoles.find(
              (pr) => pr.role.id === role.id
            )!;

            return (
              <ListboxItem
                key={`game-${game.id}`}
                className="text-left"
                href={`/games/${game.id}`}
                textValue={String(game.id)}
                showDivider
              >
                <div className="flex flex-col leading-none">
                  <span>{getGameDisplayName(game)}</span>
                  <span className="text-slate-600 text-xs">
                    {game.winningAlignment === playerRole.finalAlignment
                      ? "Victoire - "
                      : "Défaite - "}
                    Joueur : {getPlayerFullName(playerRole.player)}
                  </span>
                </div>
              </ListboxItem>
            );
          })}
        </Listbox>
      )}
    </AccordionItem>
  );

  return (
    <>
      {title}
      <Accordion
        selectionMode={"multiple"}
        defaultExpandedKeys={["main-details", "table-players-who-played-role"]}
      >
        {roleComponent}
        {detailsPlayersPlayedThisRole}
        {listGamesPlayed}
      </Accordion>
    </>
  );
}
