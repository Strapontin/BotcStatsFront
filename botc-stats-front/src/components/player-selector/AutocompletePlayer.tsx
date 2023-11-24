import { Player } from "@/entities/Player";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutocompletePlayer({
  players,
  selectedPlayer,
  setSelectedPlayer,
  autocompleteLabel,
  autocompletePlaceholder,
}: {
  players: Player[];
  selectedPlayer: Player;
  setSelectedPlayer: (player: Player) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
}) {
  return (
    <Autocomplete
      label={autocompleteLabel}
      variant="bordered"
      placeholder={autocompletePlaceholder}
      onSelectionChange={(playerId) => {
        setSelectedPlayer(players.find((e) => e.id === playerId)!);
      }}
    >
      {players.map((player) => {
        return (
          <AutocompleteItem
            key={player.id}
            aria-label={`${player.name} (${player.pseudo})`}
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
