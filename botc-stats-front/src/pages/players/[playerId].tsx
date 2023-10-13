import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import ListItemRole from "@/components/list-stats/ListItemRole";
import ListItemTwoValues from "@/components/list-stats/ListItemTwoValues";
import Title from "@/components/ui/title";
import { Player, getPlayerPseudoString } from "@/entities/Player";
import { Collapse, Loading } from "@nextui-org/react";
import { getPlayerById } from "../../../data/back-api/back-api";

export default function PlayerPage({ playerLoaded }: { playerLoaded: Player }) {
  const title = (
    <Title>
      Détails {playerLoaded.name}
      {getPlayerPseudoString(playerLoaded.pseudo)}
    </Title>
  );

  const playerComponent = playerLoaded ? (
    <Collapse expanded title="Détails généraux">
      <Container>
        <ListItem name="Parties jouées" value={playerLoaded.nbGamesPlayed} />
        <ListItemTwoValues
          key1="Gentil"
          key2="Maléfique"
          value1={playerLoaded.nbGamesGood}
          value2={playerLoaded.nbGamesEvil}
          classKey1="townsfolk"
          classKey2="red"
          classValue1="townsfolk"
          classValue2="red"
        />
        <ListItemTwoValues
          key1="Victoires"
          key2="Défaites"
          value1={playerLoaded.nbGamesWon}
          value2={playerLoaded.nbGamesLost}
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
        {playerLoaded.timesPlayedRole.map((tpr) => (
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

export async function getStaticProps({
  params,
}: {
  params: { playerId: number };
}) {
  const playerLoaded = await getPlayerById(params.playerId);

  if (!playerLoaded || playerLoaded.status === 404) {
    return { notFound: true };
  }

  return {
    props: {
      playerLoaded,
    },
    revalidate: 5,
  };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
