import { RolePlayersTable } from "@/components/table/role-players/RolePlayersTable";
import {
  getRoleIconPath,
  getWikiLinkrole,
} from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useGetGamesByRoleId } from "@/data/back-api/back-api-game";
import { useGetRoleById } from "@/data/back-api/back-api-role";
import { Game, getGameDisplayName } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { Role } from "@/entities/Role";
import {
  Accordion,
  AccordionItem,
  Button,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
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
            src={getRoleIconPath(role.name)!}
            alt={getRoleIconPath(role.name)!}
            width={150}
            height={150}
          ></Image>
        </div>
      </Title>
    </>
  );

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
      ),
    },
  ];

  if (role.playersWhoPlayedRole) {
    accordionItems.push({
      key: "table-players-who-played-role",
      title: "Détails des joueurs de ce rôle",
      children: (
        <RolePlayersTable playersWhoPlayedRole={role.playersWhoPlayedRole} />
      ),
    });
  }

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
              (pr) => pr?.role?.id === role.id
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
                    Joueur : {getPlayerFullName(playerRole.player)}
                  </span>
                </Link>
              </ListboxItem>
            );
          })}
        </Listbox>
      ),
    });
  }

  return (
    <>
      {title}
      <Button
        variant="faded"
        onPress={() => window.open(getWikiLinkrole(role.name))}
      >
        Voir le rôle sur le wiki
      </Button>
      <Accordion
        selectionMode={"multiple"}
        defaultExpandedKeys={["main-details"]}
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
