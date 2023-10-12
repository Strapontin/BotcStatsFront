import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import ListItemLarge from "@/components/list-stats/ListItemLarge";
import ListItemPlayerRole from "@/components/list-stats/ListItemPlayerRole";
import ListItemRole from "@/components/list-stats/ListItemRole";
import DateUi from "@/components/ui/date-ui";
import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { Game } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { alignmentToString } from "@/entities/enums/alignment";
import { Link, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { getAllGames, getGameById } from "../../../data/back-api/back-api";

export default function GamePage({ game }: { game: Game }) {
  const gameId: number = Number(useRouter().query.gameId);

  if (isNaN(gameId) || !game) {
    return <Title>Chargement {gameId}...</Title>;
  }

  const storyTellerPseudo = getPlayerPseudoString(game.storyTeller.pseudo);

  const title = (
    <Title>
      Détails de la partie du <DateUi date={game.datePlayed} /> contée par{" "}
      <Link href={`/players/${game.storyTeller.id}`} color="text">
        <PlayerName name={`${game.storyTeller.name}${storyTellerPseudo}`} />
      </Link>
    </Title>
  );

  return (
    <Fragment>
      {title}
      <Container>
        <ListItem name="Module" value={game.edition.name} />
        <ListItem
          name="Conteur"
          value={
            <PlayerName name={`${game.storyTeller.name}${storyTellerPseudo}`} />
          }
        />
        <ListItem
          name="Date de la partie"
          value={<DateUi date={game.datePlayed} />}
        />
        <ListItem
          name="Alignement gagnant"
          value={alignmentToString(game.winningAlignment)}
        />
        <ListItemLarge name="Notes" value={game.notes} />
        <Spacer y={2} />
        <Text b>Liste des rôles des joueurs :</Text>
        {game.playerRoles.map((prg: PlayerRole) => (
          <Link
            key={prg.player.id}
            href={`/players/${prg.player.id}`}
            color="text"
          >
            <ListItemPlayerRole
              playerName={prg.player.name}
              pseudo={prg.player.pseudo}
              roleName={prg.role.name}
              characterType={prg.role.characterType}
            />
          </Link>
        ))}
        <Spacer y={2} />
        <Text b>Liste des demon bluffs :</Text>
        {game.demonBluffs.map((db: Role) => (
          <ListItemRole
            key={db.id}
            id={db.id}
            characterType={db.characterType}
            image={db.name}
          />
        ))}
      </Container>
    </Fragment>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { gameId: number };
}) {
  const { gameId } = params;
  const game = await getGameById(gameId);

  return {
    props: {
      game,
    },
    revalidate: 10,
  };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: true };
};
