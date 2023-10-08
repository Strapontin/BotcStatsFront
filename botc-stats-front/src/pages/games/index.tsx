import { Fragment, useEffect, useState } from "react";
import { Game } from "@/entities/Game";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import PlayerName from "@/components/ui/playerName";
import { dateToString } from "@/helper/date";
import { getAllGames } from "../../../data/back-api/back-api";
import { getPlayerPseudoString } from "@/entities/Player";

export default function GamesListPage({ games }: { games: Game[] }) {
  const title = "Dernières parties jouées";

  if (games.length === 0) {
    return (
      <Fragment>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Loading />
      </Fragment>
    );
  }

  function line(game: Game) {
    return (
      <Link key={game.id} href={`/games/${game.id}`} color="text">
        <ListItem
          name={dateToString(game.datePlayed)}
          value={
            <Fragment>
              Contée par{" "}
              {
                <PlayerName
                  name={`${game.storyTeller.name}${getPlayerPseudoString(
                    game.storyTeller.pseudo
                  )}`}
                />
              }
            </Fragment>
          }
        ></ListItem>
      </Link>
    );
  }

  return (
    <Fragment>
      <Title>{title}</Title>
      <Container>{games.map((game: Game) => line(game))}</Container>
    </Fragment>
  );
}

export async function getStaticProps() {
  const games = await getAllGames();

  return {
    props: {
      games,
    },
    revalidate: 10,
  };
}
