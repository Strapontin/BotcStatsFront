import { Last30DaysWinsByAlignmentChartPie } from "@/components/chart/games/Last30DaysWinsByAlignmentChartPie";
import { Last6MonthsGamesChartBar } from "@/components/chart/games/Last6MonthsGamesChartBar";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Home() {
  return (
    <Accordion
      selectionMode={"multiple"}
      defaultExpandedKeys={[
        "table-games-last-year",
        "win-by-alignment-last-month",
      ]}
      keepContentMounted
    >
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
