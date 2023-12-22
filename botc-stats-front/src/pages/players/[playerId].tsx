import { PlayerRolesTable } from "@/components/player-roles/PlayerRolesTable";
import Title from "@/components/ui/title";
import { useGetPlayerById } from "@/data/back-api/back-api-player";
import { getPlayerPseudoString } from "@/entities/Player";
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
      key="1"
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
      key="2"
      aria-label="Détails des rôles joués"
      title="Détails des rôles joués"
    >
      <PlayerRolesTable playerRoles={player?.timesPlayedRole} />
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
