import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Player } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { Fragment, useState } from "react";
import { getAllPlayers } from "../../../../data/back-api/back-api";

export default function UpdatePlayersPage({ players }: { players: Player[] }) {
  const [filter, setFilter] = useState<string>("");
  const title = <Title>Modifier un joueur</Title>;

  if (players.length === 0) {
    return (
      <Fragment>
        {title}
        <Spacer y={3} />
        <Loading />
      </Fragment>
    );
  }

  function line(player: Player) {
    return (
      <Link key={player.id} href={`/update/players/${player.id}`} color="text">
        <ListItem name={player.name} subName={player.pseudo}></ListItem>
      </Link>
    );
  }

  return (
    <Fragment>
      {title}
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre joueur"
      ></Filter>
      <Container>
        {players
          .filter(
            (player) =>
              toLowerRemoveDiacritics(player.name).includes(
                toLowerRemoveDiacritics(filter)
              ) ||
              toLowerRemoveDiacritics(player.pseudo).includes(
                toLowerRemoveDiacritics(filter)
              )
          )
          .map((player: Player) => line(player))}
      </Container>
    </Fragment>
  );
}

export async function getStaticProps() {
  const players = await getAllPlayers();

  return {
    props: {
      players,
    },
    revalidate: 10,
  };
}
