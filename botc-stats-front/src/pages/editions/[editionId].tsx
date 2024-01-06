import Filter from "@/components/filter/Filter";
import { EditionPlayersTable } from "@/components/table/edition-players/EditionPlayersTable";
import {
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "@/components/table/generic-table/popover/listbox-items";
import { getUserRole } from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useGetEditionById } from "@/data/back-api/back-api-edition";
import { useGetGamesByEditionId } from "@/data/back-api/back-api-game";
import { Edition } from "@/entities/Edition";
import { Game, getGameDisplayName } from "@/entities/Game";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { toLowerRemoveDiacritics } from "@/helper/string";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function EditionIdPage() {
  const classNamesListBoxItem = useMemo(() => {
    return { title: "text-left font-bold" };
  }, []);

  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);

  const { data: edition, isLoading }: { data: Edition; isLoading: boolean } =
    useGetEditionById(editionId);
  const { data: gamesPlayed, isLoading: isLoadingGamesPlayed } =
    useGetGamesByEditionId(editionId);

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const filteredRoles = edition.roles.filter((role: Role) =>
    toLowerRemoveDiacritics(role.name).includes(toLowerRemoveDiacritics(filter))
  );

  function getPopoverContent(role: Role) {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemRoleDetails(role, router)}
        {getListboxItemRoleWikiLink(role, router)}
      </Listbox>
    );
  }

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
            endContent={edition.timesPlayed}
            classNames={classNamesListBoxItem}
            showDivider
          >
            Parties jouées
          </ListboxItem>
          <ListboxItem
            key={3}
            endContent={`${edition.timesGoodWon} | ${edition.timesEvilWon}`}
            classNames={classNamesListBoxItem}
          >
            <div>
              Victoires <div>Gentils | Maléfiques</div>
            </div>
          </ListboxItem>
        </Listbox>
      ),
    },
    {
      key: "roles-in-edition",
      title: "Rôles du module",
      children: (
        <>
          <Filter
            filterValue={filter}
            setFilter={setFilter}
            placeholder="Filtre rôle"
          />
          <Spacer y={2} />
          <div className="p-2 flex flex-col items-start gap-3">
            {filteredRoles.map((r: Role) => (
              <Popover key={r.id} showArrow>
                <PopoverTrigger>
                  <div className="cursor-pointer w-full">{getUserRole(r)}</div>
                </PopoverTrigger>
                <PopoverContent>{getPopoverContent(r)}</PopoverContent>
              </Popover>
            ))}
          </div>
        </>
      ),
    },
  ];

  if (edition.playersWhoPlayedEdition) {
    accordionItems.push({
      key: "table-players-who-played-edition",
      title: "Détails des joueurs de ce module",
      children: (
        <EditionPlayersTable
          playersWhoPlayedEdition={edition.playersWhoPlayedEdition}
        />
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
                    {game.playerRoles.length.toLocaleString("fr-FR", {
                      minimumIntegerDigits: 2,
                    })}{" "}
                    joueurs -{" "}
                    {game.winningAlignment === Alignment.Good
                      ? "Victoire des Gentils"
                      : "Victoire des Maléfiques"}
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
      <Title>{`Détails du module '${edition.name}'`}</Title>
      <Spacer y={3} />
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
