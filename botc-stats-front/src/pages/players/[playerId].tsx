import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import ListItemRole from "@/components/list-stats/ListItemRole";
import ListItemTwoValues from "@/components/list-stats/ListItemTwoValues";
import Title from "@/components/ui/title";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerPseudoString,
} from "@/entities/Player";
import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPlayerById } from "../../../data/back-api/back-api";

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

  const playerComponent = player ? (
    <AccordionItem
      key="1"
      aria-label="Détails généraux"
      subtitle="Press to expand"
      title="Détails généraux"
    >
      <Container>
        <ListItem left="Parties jouées" value={player.nbGamesPlayed} />
        <ListItemTwoValues
          key1="Gentil"
          key2="Maléfique"
          value1={player.nbGamesGood}
          value2={player.nbGamesEvil}
          classKey1="townsfolk"
          classKey2="red"
          classValue1="townsfolk"
          classValue2="red"
        />
        <ListItemTwoValues
          key1="Victoires"
          key2="Défaites"
          value1={player.nbGamesWon}
          value2={player.nbGamesLost}
          classKey1="green"
          classKey2="red"
          classValue1="green"
          classValue2="red"
        />
      </Container>
    </AccordionItem>
  ) : (
    <></>
  );

  const detailsRolesPlayed = (
    <AccordionItem
      key="2"
      aria-label="Détails des rôles joués"
      subtitle="Press to expand"
      title="Détails des rôles joués"
    >
      <Container>
        {player.timesPlayedRole.map((tpr) => (
          <ListItemRole
            key={tpr.id}
            id={tpr.id}
            image={tpr.name}
            characterType={tpr.characterType}
            nbWins={tpr.timesWonByPlayer}
            nbLoses={tpr.timesLostByPlayer}
            nbGamesPlayed={tpr.timesPlayedByPlayer}
          />
        ))}
      </Container>
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
