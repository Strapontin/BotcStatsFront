import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import PlayerName from "@/components/ui/playerName";
import Title from "@/components/ui/title";
import { Game } from "@/entities/Game";
import { getPlayerPseudoString } from "@/entities/Player";
import { dateToString } from "@/helper/date";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { getAllGames } from "../../../../data/back-api/back-api";

export default function UpdateGamesPage({ games }: { games: Game[] }) {
  const title = <Title>Modifier une partie</Title>;

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
    return (
      <Link key={game.id} href={`/update/games/${game.id}`} color="text">
        <ListItem
          name={dateToString(game.datePlayed)}
          value={
            <>
              Contée par{" "}
              {
                <PlayerName
                  name={`${game.storyTeller.name}${getPlayerPseudoString(
                    game.storyTeller.pseudo
                  )}`}
                />
              }
            </>
          }
        ></ListItem>
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

export async function getServerSideProps() {
  const games = await getAllGames();

  return {
    props: {
      games,
    },
  };
}
