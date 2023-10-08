import { Fragment, useEffect, useState } from "react";
import { Player } from "@/entities/Player";
import Container from "@/components/list-stats/Container";
import ListItem from "@/components/list-stats/ListItem";
import Title from "@/components/ui/title";
import { Link, Loading, Spacer } from "@nextui-org/react";
import { getAllPlayers } from "../../../data/back-api/back-api";
import Filter from "@/components/filter/Filter";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function GamesPlayedByPlayerPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState<string>("");
  const title = "Nombre de parties/joueur";

  useEffect(() => {
    async function initPlayers() {
      const p = await getAllPlayers();
      p.sort((a: Player, b: Player) => b.nbGamesPlayed - a.nbGamesPlayed);
      setPlayers(p);
    }
    initPlayers();
  }, []);

  if (players.length === 0) {
    return (
      <Fragment>
        <Title>{title}</Title>
        <Spacer y={3} />
        <Loading />
      </Fragment>
    );
  }

  return (
    <Fragment>
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
    </Fragment>
  );
}
