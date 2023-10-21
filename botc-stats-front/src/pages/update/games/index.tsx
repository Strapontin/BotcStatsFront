import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { Game } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { getAllGames } from "../../../../data/back-api/back-api";
import { useState, useEffect } from "react";

export default function UpdateGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const title = <Title>Modifier une partie</Title>;

  useEffect(() => {
    getAllGames().then((g) => {
      setGames(g);
    });
  }, []);

  if (games.length === 0) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Loading />
      </>
    );
  }

  function line(game: Game) {
    const storyTelledBy = (
      <>
        {dateToString(game.datePlayed)} - Contée par{" "}
        {
          <PlayerName
            name={`${game.storyTeller.name}${getPlayerPseudoString(
              game.storyTeller.pseudo
            )}`}
          />
        }
      </>
    );

    return (
      <Link key={game.id} href={`/update/games/${game.id}`} color="text">
        <ListItem left={storyTelledBy}></ListItem>
      </Link>
    );
  }

  return (
    <>
      {title}
      <Container>{games.map((game: Game) => line(game))}</Container>
    </>
  );
}
