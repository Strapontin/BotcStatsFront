import ListboxPlayerRolesComponent from "@/components/listbox/ListboxPlayerRolesComponent";
import ListboxRolesComponent from "@/components/listbox/ListboxRolesComponent";
import DateUi from "@/components/ui/date-ui";
import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { useGetGameById } from "@/data/back-api/back-api-game";
import { getPlayerPseudoString } from "@/entities/Player";
import { alignmentToString } from "@/entities/enums/alignment";
import { dateToString } from "@/helper/date";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();
  const gameId: number = Number(router.query.gameId);

  const { data: game, isLoading } = useGetGameById(gameId);

  if (isLoading || !gameId) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const storyTellerPseudo = getPlayerPseudoString(game.storyTeller.pseudo);

  const title = (
    <Title>
      Détails de la partie du <DateUi date={game.datePlayed} /> contée par{" "}
      <PlayerName name={`${game.storyTeller.name}${storyTellerPseudo}`} />
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
      <Listbox aria-label="Détails de la partie" variant="light">
        <ListboxItem
          key={1}
          endContent={game.edition.name}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Module
        </ListboxItem>
        <ListboxItem
          key={2}
          endContent={`${game.storyTeller.name}${storyTellerPseudo}`}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Conteur
        </ListboxItem>
        <ListboxItem
          key={3}
          endContent={dateToString(game.datePlayed)}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Date de la partie
        </ListboxItem>
        <ListboxItem
          key={4}
          endContent={alignmentToString(game.winningAlignment)}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Alignement gagnant
        </ListboxItem>
        <ListboxItem key={5} classNames={classNamesListBoxItem}>
          Notes
        </ListboxItem>
        <ListboxItem
          key={6}
          className="text-justify"
          endContent={`${game.notes}`}
          classNames={classNamesListBoxItem}
          textValue={game.notes}
          showDivider
        />
      </Listbox>
      <Spacer y={12} />
      <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
        <AccordionItem
          key="1"
          aria-label="Liste des rôles des joueurs"
          title="Liste des rôles des joueurs"
        >
          <ListboxPlayerRolesComponent playerRoles={game.playerRoles} />
        </AccordionItem>
        <AccordionItem
          key="2"
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
