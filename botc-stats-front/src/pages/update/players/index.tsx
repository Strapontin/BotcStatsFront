import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Player } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllPlayers } from "../../../../data/back-api/back-api";

export default function UpdatePlayersPage() {
  const [filter, setFilter] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const title = <Title>Modifier un joueur</Title>;

  useEffect(() => {
    getAllPlayers().then((p) => {
      setPlayers(p);
    });
  }, []);

  if (players.length === 0) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Loading />
      </>
    );
  }

  function line(player: Player) {
    return (
      <Link key={player.id} href={`/update/players/${player.id}`} color="text">
        <ListItem left={player.name} subName={player.pseudo}></ListItem>
      </Link>
    );
  }

  return (
    <>
      {title}
      <Spacer y={1} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre joueur"
      />
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
    </>
  );
}
