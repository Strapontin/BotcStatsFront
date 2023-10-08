import { Fragment, useEffect, useState } from "react";
import Title from "@/components/ui/title";
import { getAllPlayers } from "../../../../data/back-api/back-api";
import { Link, Loading, Spacer, Text } from "@nextui-org/react";
import Container from "@/components/list-stats/Container";
import { Player } from "@/entities/Player";
import ListItem from "@/components/list-stats/ListItem";
import Filter from "@/components/filter/Filter";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function UpdatePlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState<string>("");
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
