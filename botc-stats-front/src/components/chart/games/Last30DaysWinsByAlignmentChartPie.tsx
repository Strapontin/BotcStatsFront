import { useGetGames } from "@/data/back-api/back-api-game";
import { Game } from "@/entities/Game";
import { Alignment } from "@/entities/enums/alignment";
import { Spinner } from "@nextui-org/react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(...registerables);

export function Last30DaysWinsByAlignmentChartPie() {
  const { data: games, isLoading } = useGetGames();

  if (isLoading) {
    return <Spinner />;
  }

  const last30DaysGames = games.filter(
    (game: Game) =>
      new Date(game.datePlayed) >
      new Date(new Date().setDate(new Date().getDate() - 30))
  );

  const data = {
    labels: ["Victoires des gentils", "Victoires des maléfiques"],
    datasets: [
      {
        label: "30 derniers jours",
        data: [
          last30DaysGames.filter(
            (game: Game) => game.winningAlignment === Alignment.Good
          ).length,
          last30DaysGames.filter(
            (game: Game) => game.winningAlignment === Alignment.Evil
          ).length,
        ],
        backgroundColor: ["#08c1ff", "rgb(197, 0, 0)"],
      },
    ],
  };

  return (
    <Pie
      style={{ height: 300 }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
        maintainAspectRatio: false,
      }}
      data={data}
    />
  );
}
