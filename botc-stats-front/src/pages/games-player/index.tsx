import Filter from "@/components/filter/Filter";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Player } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAllPlayers } from "../../../data/back-api/back-api";

export default function GamesPlayedByPlayerPage() {
  const [filter, setFilter] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const title = "Nombre de parties/joueur";

  useEffect(() => {
    getAllPlayers().then((p) => {
      const sortedPlayers = p.sort(
        (a: Player, b: Player) => b.nbGamesPlayed - a.nbGamesPlayed
      );
      setPlayers(sortedPlayers);
    });
  }, []);

  if (players.length === 0) {
    return (
      <>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Title>{title}</Title>
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
          .map((player) => (
            <Link key={player.id} href={`/players/${player.id}`} color="text">
              <ListItem
                name={player.name}
                subName={player.pseudo}
                value={player.nbGamesPlayed}
              />
            </Link>
          ))}
      </Container>
    </>
  );
}
