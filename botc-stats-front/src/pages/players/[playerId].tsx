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
import { Collapse, Loading } from "@nextui-org/react";
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
        <Loading />
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
    <Collapse expanded title="Détails généraux">
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
    </Collapse>
  ) : (
    <></>
  );

  const detailsRolesPlayed = (
    <Collapse expanded title="Détails des rôles joués">
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
    </Collapse>
  );

  return (
    <>
      {title}
      <Collapse.Group css={{ w: "100%" }}>{playerComponent}</Collapse.Group>
      <Collapse.Group css={{ w: "100%" }}>{detailsRolesPlayed}</Collapse.Group>
    </>
  );
}
