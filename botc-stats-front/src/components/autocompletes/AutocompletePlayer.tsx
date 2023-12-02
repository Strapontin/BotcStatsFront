import { Player, getPlayerFullName } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutocompletePlayer({
  players,
  isLoading,
  setSelectedPlayer,
  autocompleteLabel,
  autocompletePlaceholder,
  defaultSelectedKey,
}: {
  players: Player[];
  isLoading?: boolean;
  setSelectedPlayer: (player: Player) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
  defaultSelectedKey?: string;
}) {
  const playersSorted = isLoading
    ? []
    : players.sort((a, b) =>
        toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
          ? -1
          : 1
      );

  return (
    <Autocomplete
      label={autocompleteLabel}
      variant="bordered"
      placeholder={autocompletePlaceholder}
      onSelectionChange={(playerId) => {
        setSelectedPlayer(players.find((e) => e.id === +playerId)!);
      }}
      isLoading={isLoading}
      defaultSelectedKey={defaultSelectedKey}
    >
      {playersSorted.map((player) => {
        return (
          <AutocompleteItem
            key={player.id}
            aria-label={getPlayerFullName(player)}
          >
            <div className="flex flex-col">
              <span>{player.name}</span>
              <span className="text-default-400 text-sm">{player.pseudo}</span>
            </div>
          </AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
