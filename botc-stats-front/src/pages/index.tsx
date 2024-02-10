import { Last30DaysWinsByAlignmentChartPie } from "@/components/chart/games/Last30DaysWinsByAlignmentChartPie";
import { Last6MonthsGamesChartBar } from "@/components/chart/games/Last6MonthsGamesChartBar";
import { GamesDraftTable } from "@/components/table/games-draft/GamesDraftTable";
import { useGetGamesDraft } from "@/data/back-api/back-api-game-draft";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: gamesDraft, isLoading } = useGetGamesDraft();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [isLoading]);

  return (
    <Accordion
      key={key}
      selectionMode={"multiple"}
      defaultExpandedKeys={[
        gamesDraft?.length ? "table-games-draft" : "",
        "table-games-last-year",
        "win-by-alignment-last-month",
      ]}
      keepContentMounted
    >
      <AccordionItem
        key="table-games-draft"
        aria-label="Rappel de parties (pour les conteurs)"
        title="Rappel de parties (pour les conteurs)"
      >
        <GamesDraftTable />
      </AccordionItem>
      <AccordionItem
        key="table-games-last-year"
        aria-label="Parties jouées les 6 derniers mois"
        title="Parties jouées les 6 derniers mois"
      >
        <Last6MonthsGamesChartBar />
      </AccordionItem>
      <AccordionItem
        key="win-by-alignment-last-month"
        aria-label="Victoires par alignement des 30 derniers jours"
        title="Victoires par alignement des 30 derniers jours"
      >
        <Last30DaysWinsByAlignmentChartPie />
      </AccordionItem>
    </Accordion>
  );
}
