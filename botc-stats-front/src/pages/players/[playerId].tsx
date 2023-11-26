import { getAvatarRole } from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useGetPlayerById } from "@/data/back-api/back-api-player";
import { getPlayerPseudoString } from "@/entities/Player";
import { Role } from "@/entities/Role";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import NotFoundPage from "../404";

export default function PlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const { data: player, isLoading } = useGetPlayerById(playerId);

  console.log(isLoading, playerId);
  if (isLoading || !playerId) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (player.status === 404) {
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

  const classNamesListBoxItem = {
    title: "text-left font-bold",
  };

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
      <Listbox aria-label="Rôles sélectionnés">
        {player.timesPlayedRole.map((role: Role) => (
          <ListboxItem
            key={role.id}
            // href={`/roles/${role.id}`} //TODO when roles details are implemented
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
