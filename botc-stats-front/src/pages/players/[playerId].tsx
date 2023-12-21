import {
  getCssClassesFromCharacterType,
  getRoleIconPath,
} from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useGetPlayerById } from "@/data/back-api/back-api-player";
import { getPlayerPseudoString } from "@/entities/Player";
import { Role } from "@/entities/Role";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useRouter } from "next/router";
import { Key, useCallback, useMemo } from "react";
import NotFoundPage from "../404";

export default function PlayerPage() {
  const classNamesListBoxItem = useMemo(() => {
    return { title: "text-left font-bold" };
  }, []);

  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const { data: player, isLoading } = useGetPlayerById(playerId);

  const renderCell = useCallback((role: Role, columnKey: Key) => {
    const cellValue: string = role[columnKey as keyof Role] as string;

    switch (columnKey) {
      case "name":
        return (
          <div className="flex justify-left text-left">
            <User
              name={cellValue}
              classNames={{ wrapper: "flex-1" }}
              avatarProps={{
                src: getRoleIconPath(cellValue),
                size: "sm",
                radius: "lg",
                isBordered: true,
                classNames: {
                  base:
                    getCssClassesFromCharacterType(role.characterType)
                      .ringColorClass + " w-8 ",
                },
              }}
            />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  let list = useAsyncList({
    load() {
      if (!player?.timesPlayedRole) return { items: [] };

      return {
        items: player.timesPlayedRole,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: Role, b: Role) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (player.status === 404) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = (
    <Title>
      Détails {player.name}
      {getPlayerPseudoString(player.pseudo)}
    </Title>
  );

  const playerComponent = player ? (
    <AccordionItem
      key="1"
      aria-label="Détails généraux"
      title="Détails généraux"
    >
      <Listbox aria-label="Détails généraux" variant="light">
        <ListboxItem
          key={1}
          endContent={player.nbGamesPlayed}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Parties jouées
        </ListboxItem>
        <ListboxItem
          key={2}
          endContent={`${player.nbGamesGood} | ${player.nbGamesEvil}`}
          classNames={classNamesListBoxItem}
          showDivider
        >
          Gentil | Maléfique
        </ListboxItem>
        <ListboxItem
          key={3}
          endContent={`${player.nbGamesWon} | ${player.nbGamesLost}`}
          classNames={classNamesListBoxItem}
        >
          Victoires | Défaites
        </ListboxItem>
      </Listbox>
    </AccordionItem>
  ) : (
    <></>
  );

  const detailsRolesPlayed = (
    <AccordionItem
      key="2"
      aria-label="Détails des rôles joués"
      title="Détails des rôles joués"
    >
      <Table
        aria-label="Player role list"
        removeWrapper
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="name" align="end" className="px-0 pl-3 ">
            Role
          </TableColumn>
          <TableColumn key="timesPlayedByPlayer" allowsSorting className="px-0">
            Total
          </TableColumn>
          <TableColumn key="timesWonByPlayer" allowsSorting className="px-0">
            Wins
          </TableColumn>
          <TableColumn key="timesLostByPlayer" allowsSorting className="px-0">
            Loses
          </TableColumn>
        </TableHeader>
        <TableBody items={player.timesPlayedRole}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell className="">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </AccordionItem>
  );

  return (
    <>
      {title}
      <Accordion selectionMode={"multiple"} defaultExpandedKeys={["1", "2"]}>
        {playerComponent}
        {detailsRolesPlayed}
      </Accordion>
    </>
  );
}
