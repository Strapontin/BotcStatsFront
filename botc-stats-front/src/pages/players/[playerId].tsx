import { Fragment, useEffect, useState } from "react";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerPseudoString,
} from "@/entities/Player";
import { useRouter } from "next/router";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Collapse, Loading } from "@nextui-org/react";
import ListItemRole from "@/components/list-stats/ListItemRole";
import ListItemTwoValues from "@/components/list-stats/ListItemTwoValues";
import { getPlayerById } from "../../../data/back-api/back-api";

export default function PlayerPage() {
  const playerId = useRouter().query.playerId;
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());
  const [detailsRolesPlayed, setDetailsRolesPlayed] = useState(<Loading />);

  useEffect(() => {
    async function initPlayer() {
      if (playerId === undefined) return;

      const p = await getPlayerById(+playerId);
      if (p !== undefined) {
        setPlayer(p);
      }
    }
    initPlayer();
  }, [playerId]);

  useEffect(() => {
    async function initDetailsRolesPlayed() {
      if (player.id === -1) return;

      setDetailsRolesPlayed(
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
    }
    initDetailsRolesPlayed();
  }, [player]);

  if (!playerId) {
    <Loading />;
    return;
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
        <ListItem name="Parties jouées" value={player.nbGamesPlayed} />
        <ListItemTwoValues
          key1="Gagnées"
          key2="Perdues"
          value1={player.nbGamesWon}
          value2={player.nbGamesLost}
          classKey1="green"
          classKey2="red"
          classValue1="green"
          classValue2="red"
        />

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
      </Container>
    </Collapse>
  ) : (
    <Fragment />
  );

  return (
    <Fragment>
      {title}
      <Collapse.Group css={{ w: "100%" }}>{playerComponent}</Collapse.Group>
      <Collapse.Group css={{ w: "100%" }}>{detailsRolesPlayed}</Collapse.Group>
    </Fragment>
  );
}
