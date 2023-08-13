import { Fragment, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import { getAllPlayers } from "../../../../data/back-api/back-api";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import Container from "@/components/list-stats/Container";
import { Player } from "@/entities/Player";
import ListItem from "@/components/list-stats/ListItem";

export default function UpdatePlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const title = <Title>Modifier un joueur</Title>;

  useEffect(() => {
    async function initPlayers() {
      const tempPlayers = await getAllPlayers();
      setPlayers(tempPlayers);
    }
    initPlayers();
  }, []);

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
      <Container>{players.map((player: Player) => line(player))}</Container>
    </Fragment>
  );
}
