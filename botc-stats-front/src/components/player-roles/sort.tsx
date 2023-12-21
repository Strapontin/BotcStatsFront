import { Role } from "@/entities/Role";
import { Select, SelectItem, Selection, Spacer } from "@nextui-org/react";
import { ReactElement, useState } from "react";

export function useSortPlayerRoles(playerRoles: Role[]): {
  select?: ReactElement;
  sortedRoles?: Role[];
  sortedByKey?: string;
} {
  const sortOptions = [
    { key: "Total", text: "Nombre total de parties" },
    { key: "Wins", text: "Victoires" },
    { key: "Loses", text: "Défaites" },
  ];

  const [sortedValue, setSortedValue] = useState<Selection>();

  if (!playerRoles) return {};

  let sortedRoles;
  switch (sortedValue) {
    case "Total" as Selection:
    default:
      sortedRoles = playerRoles.sort((a: Role, b: Role) => {
        return (
          (b.timesPlayedByPlayer - a.timesPlayedByPlayer) * 1 +
          (b.timesWonByPlayer - a.timesWonByPlayer) * 0.1
        );
      });
      break;

    case "Wins" as Selection:
      sortedRoles = playerRoles.sort((a: Role, b: Role) => {
        return (
          (b.timesWonByPlayer - a.timesWonByPlayer) * 1 +
          (b.timesPlayedByPlayer - a.timesPlayedByPlayer) * 0.1
        );
      });
      break;

    case "Loses" as Selection:
      sortedRoles = playerRoles.sort((a: Role, b: Role) => {
        return (
          (b.timesLostByPlayer - a.timesLostByPlayer) * 1 +
          (b.timesPlayedByPlayer - a.timesPlayedByPlayer) * 0.1
        );
      });
      break;
  }

  return {
    select: (
      <>
        <Select
          disallowEmptySelection
          label="Trier par"
          defaultSelectedKeys={[sortOptions[0].key]}
          onSelectionChange={(v) =>
            setSortedValue(Array.from(v)[0] as Selection)
          }
        >
          {sortOptions.map((v) => (
            <SelectItem key={v.key} value={v.key}>
              {v.text}
            </SelectItem>
          ))}
        </Select>
        <Spacer y={5} />
      </>
    ),
    sortedRoles,
    sortedByKey: sortedValue ? sortedValue.toString() : sortOptions[0].key,
  };
}
