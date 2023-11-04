import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import ListItemLarge from "@/components/list-stats/ListItemLarge";
import ListItemPlayerRole from "@/components/list-stats/ListItemPlayerRole";
import ListItemRole from "@/components/list-stats/ListItemRole";
import DateUi from "@/components/ui/date-ui";
import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { Game, getNewEmptyGame } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { alignmentToString } from "@/entities/enums/alignment";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getGameById } from "../../../data/back-api/back-api";

export default function GamePage() {
  const router = useRouter();
  const gameId: number = Number(router.query.gameId);
  const [game, setGame] = useState<Game>(getNewEmptyGame());
  const storyTellerPseudo = getPlayerPseudoString(game.storyTeller.pseudo);

  useEffect(() => {
    if (!gameId || isNaN(gameId)) return;

    getGameById(gameId).then((g) => setGame(g));
  }, [gameId]);

  if (game.id <= 0) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const title = (
    <Title>
      Détails de la partie du <DateUi date={game.datePlayed} /> contée par{" "}
      <Link href={`/players/${game.storyTeller.id}`} color="text">
        <PlayerName name={`${game.storyTeller.name}${storyTellerPseudo}`} />
      </Link>
    </Title>
  );

  return (
    <>
      {title}
      <Container>
        <ListItem left="Module" value={game.edition.name} />
        <ListItem
          left="Conteur"
          value={
            <PlayerName name={`${game.storyTeller.name}${storyTellerPseudo}`} />
          }
        />
        <ListItem
          left="Date de la partie"
          value={<DateUi date={game.datePlayed} />}
        />
        <ListItem
          left="Alignement gagnant"
          value={alignmentToString(game.winningAlignment)}
        />
        <ListItemLarge name="Notes" value={game.notes} />
        <Spacer y={2} />
        <Text b>Liste des rôles des joueurs :</Text>
        {game.playerRoles.map((prg: PlayerRole, index) => (
          <Link
            key={`${prg.player.id}-${prg.role.id}-${index}`}
            href={`/players/${prg.player.id}`}
            color="text"
          >
            <ListItemPlayerRole playerRole={prg} />
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
    </>
  );
}
