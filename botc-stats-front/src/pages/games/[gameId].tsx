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
import { Link, Spinner, Spacer, Listbox, ListboxItem } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getGameById } from "../../../data/back-api/back-api";
import { dateToString } from "@/helper/date";

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
        <Spinner />
      </>
    );
  }

  const title = (
    <Title>
      Détails de la partie du <DateUi date={game.datePlayed} /> contée par{" "}
      <PlayerName name={`${game.storyTeller.name}${storyTellerPseudo}`} />
    </Title>
  );

  const classNamesListBoxItem = {
    title: "text-left font-bold",
  };

  return (
    <>
      {title}
      <Spacer y={5} />
      <Listbox
        aria-label="Détails de la partie"
        variant="light"
        classNames={{ list: { base: "" } }}
      >
        <ListboxItem
          key={1}
          endContent={game.edition.name}
          classNames={classNamesListBoxItem}
        >
          Module
        </ListboxItem>
        <ListboxItem
          key={2}
          endContent={`${game.storyTeller.name}${storyTellerPseudo}`}
          classNames={classNamesListBoxItem}
        >
          Conteur
        </ListboxItem>
        <ListboxItem
          key={3}
          endContent={dateToString(game.datePlayed)}
          classNames={classNamesListBoxItem}
        >
          Date de la partie
        </ListboxItem>
        <ListboxItem
          key={4}
          endContent={alignmentToString(game.winningAlignment)}
          classNames={classNamesListBoxItem}
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
        />
      </Listbox>
      <Spacer y={2} />
      <span>Liste des rôles des joueurs :</span>
      {game.playerRoles.map((prg: PlayerRole, index) => (
        <Link
          key={`${prg.player.id}-${prg.role.id}-${index}`}
          href={`/players/${prg.player.id}`}
        >
          <ListItemPlayerRole playerRole={prg} />
        </Link>
      ))}
      <Spacer y={2} />
      <span>Liste des demon bluffs :</span>
      {game.demonBluffs.map((db: Role) => (
        <ListItemRole
          key={db.id}
          id={db.id}
          characterType={db.characterType}
          image={db.name}
        />
      ))}
    </>
  );
}
