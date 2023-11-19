import ListItem from "@/components/list-stats/ListItem";
import ListItemRole from "@/components/list-stats/ListItemRole";
import ListItemTwoValues from "@/components/list-stats/ListItemTwoValues";
import Title from "@/components/ui/title";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerPseudoString,
} from "@/entities/Player";
import {
  Accordion,
  AccordionItem,
  Button,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPlayerById } from "../../../data/back-api/back-api";
import RolesSelector from "@/components/roles-selector/RolesSelector";
import { getAvatarRole } from "@/components/ui/image-role-name";
import { X } from "react-feather";

export default function PlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());

  useEffect(() => {
    if (!playerId || isNaN(playerId)) return;

    getPlayerById(playerId).then((p) => setPlayer(p));
  }, [playerId]);

  if (player.id < 0) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const title = (
    <Title>
      Détails {player.name}
      {getPlayerPseudoString(player.pseudo)}
    </Title>
  );

  const classNamesListBoxItem = {
    title: "text-left font-bold",
  };

  const playerComponent = player ? (
    <AccordionItem
      key="1"
      aria-label="Détails généraux"
      title="Détails généraux"
    >
      <Listbox aria-label="Détails généraux">
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
      key="2"
      aria-label="Détails des rôles joués"
      title="Détails des rôles joués"
    >
      <Listbox aria-label="Rôles sélectionnés">
        {player.timesPlayedRole.map((role) => (
          <ListboxItem
            key={role.id}
            // href={`/roles/${role.id}`}
            startContent={getAvatarRole(role)}
            endContent={`${role.timesWonByPlayer} | ${role.timesLostByPlayer} | ${role.timesPlayedByPlayer}`}
            classNames={classNamesListBoxItem}
          >
            {role.name}
          </ListboxItem>
        ))}
      </Listbox>
    </AccordionItem>
  );

  return (
    <>
      {title}
      <Accordion selectionMode={"multiple"} defaultExpandedKeys={["1", "2"]}>
        {playerComponent}
        {detailsRolesPlayed}
      </Accordion>
    </>
  );
}
