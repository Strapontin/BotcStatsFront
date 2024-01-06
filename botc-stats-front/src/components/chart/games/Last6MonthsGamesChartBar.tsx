import { useGetGames } from "@/data/back-api/back-api-game";
import { GrouppedGames, groupGamesByMonthPlayed } from "@/entities/Game";
import { Alignment } from "@/entities/enums/alignment";
import { Spinner } from "@nextui-org/react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(...registerables);

interface Data {
  label: string;
  totalGamesPlayed: number;
  winsGood: number;
  winsEvil: number;
}

export function Last6MonthsGamesChartBar() {
  const { data: games, isLoading } = useGetGames();

  if (isLoading) {
    return <Spinner />;
  }

  const grouppedGames = groupGamesByMonthPlayed(games);

  function getDataMonth(
    grouppedGames: GrouppedGames,
    monthNumber: number
  ): Data {
    let labels = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Aout",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const monthGames = grouppedGames[monthNumber];

    return {
      label: labels[monthNumber],
      totalGamesPlayed: monthGames?.length,
      winsGood: monthGames?.filter((g) => g.winningAlignment === Alignment.Good)
        ?.length,
      winsEvil: monthGames?.filter((g) => g.winningAlignment === Alignment.Evil)
        ?.length,
    };
  }

  const currentMonthNumber = new Date().getMonth();
  const monthsData: Data[] = [];

  for (let i = currentMonthNumber - 5; i < currentMonthNumber + 1; i++) {
    monthsData.push(getDataMonth(grouppedGames, ((i % 12) + 12) % 12));
  }

  const datasets = [
    {
      label: "Total de parties",
      data: monthsData.map((m) => m.totalGamesPlayed),
      backgroundColor: "rgb(0, 197, 0)",
    },
    {
      label: "Victoires des gentils",
      data: monthsData.map((m) => m.winsGood),
      backgroundColor: "#08c1ff",
    },
    {
      label: "Victoires des maléfiques",
      data: monthsData.map((m) => m.winsEvil),
      backgroundColor: "rgb(197, 0, 0)",
    },
  ];

  const data = {
    labels: monthsData.map((m) => m.label),
    datasets: datasets,
  };

  return (
    <Bar
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
