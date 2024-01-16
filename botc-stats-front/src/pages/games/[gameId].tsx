import ListboxPlayerRolesComponent from "@/components/listbox/ListboxPlayerRolesComponent";
import ListboxRolesComponent from "@/components/listbox/ListboxRolesComponent";
import { getListboxItemPlayerDetails } from "@/components/table/generic-table/popover/listbox-items";
import Title from "@/components/ui/title";
import { useGetGameById } from "@/data/back-api/back-api-game";
import { Game } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { alignmentToString } from "@/entities/enums/alignment";
import { dateToString } from "@/helper/date";
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
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();
  const gameId: number = Number(router.query.gameId);

  const { data: game, isLoading }: { data: Game; isLoading: boolean } =
    useGetGameById(gameId);

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const storytellerWithPopover = (
    <Popover showArrow>
      <PopoverTrigger>{getPlayerFullName(game.storyteller)}</PopoverTrigger>
      <PopoverContent>
        <Listbox aria-label="popover-items">
          {getListboxItemPlayerDetails(game.storyteller)}
        </Listbox>
      </PopoverContent>
    </Popover>
  );

  const title = (
    <Title>
      Détails de la partie du {dateToString(game.datePlayed)} contée par{" "}
      {storytellerWithPopover}
    </Title>
  );

  const classNamesListBoxItem = {
    title: "text-left font-bold",
    base: "whitespace-pre-line",
  };

  return (
    <>
      {title}
      <Spacer y={5} />
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["main-details"]}
      >
        <AccordionItem
          key="main-details"
          aria-label="Détails généraux"
          title="Détails généraux"
        >
          <div>
            <Listbox aria-label="Détails de la partie" variant="light">
              <ListboxItem
                key={"edition"}
                endContent={game.edition.name}
                classNames={classNamesListBoxItem}
                showDivider
              >
                Module
              </ListboxItem>
              <ListboxItem
                key={"storyteller"}
                endContent={storytellerWithPopover}
                classNames={classNamesListBoxItem}
                showDivider
              >
                Conteur
              </ListboxItem>
              <ListboxItem
                key={"date-played"}
                endContent={dateToString(game.datePlayed)}
                classNames={classNamesListBoxItem}
                showDivider
              >
                Date de la partie
              </ListboxItem>
              <ListboxItem
                key={"winning-alignment"}
                endContent={alignmentToString(game.winningAlignment)}
                classNames={classNamesListBoxItem}
                showDivider
              >
                Alignement gagnant
              </ListboxItem>
            </Listbox>
            <Textarea
              isReadOnly
              classNames={{
                label: "pl-[9px] font-extrabold",
                innerWrapper: "pl-6",
              }}
              variant="underlined"
              label="Notes"
              aria-label="Notes"
              value={game.notes}
            />
          </div>
        </AccordionItem>
        <AccordionItem
          key="player-roles"
          aria-label="Liste des rôles des joueurs"
          title="Liste des rôles des joueurs"
        >
          <ListboxPlayerRolesComponent playerRoles={game.playerRoles} />
        </AccordionItem>
        <AccordionItem
          key="demon-bluffs"
          aria-label="Liste des Demon Bluffs"
          title="Liste des Demon Bluffs"
        >
          <ListboxRolesComponent roles={game.demonBluffs} />
        </AccordionItem>
      </Accordion>
      <Spacer y={5} />
    </>
  );
}
