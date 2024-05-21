import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Player, getPlayerFullName } from "@/entities/Player";
import { stringContainsString, toLowerRemoveDiacritics } from "@/helper/string";
import CreatePlayer from "@/pages/create/player";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalContent,
} from "@nextui-org/react";
import { useState } from "react";

export default function AutocompletePlayer({
  setSelectedPlayer,
  autocompleteLabel,
  autocompletePlaceholder,
  defaultSelectedKey,
  canAddNewPlayer,
  autoFocus,
  autocompleteSize,
  playersIdToHide,
}: {
  setSelectedPlayer: (player: Player) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
  defaultSelectedKey?: string;
  canAddNewPlayer?: boolean;
  autoFocus?: boolean;
  autocompleteSize?: "sm" | "md" | "lg";
  playersIdToHide?: number[];
}) {
  const { data: players, isLoading } = useGetPlayers();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(0);
  const [filterAutocomplete, setFilterAutocomplete] = useState<string>("");
  const [showModalCreatePlayer, setShowModalCreatePlayer] =
    useState<boolean>(false);

  const playersSorted = isLoading
    ? []
    : players.sort((a, b) =>
        toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
          ? -1
          : 1
      );

  const items = playersSorted
    .filter((player, index, array) => {
      return (
        !playersIdToHide?.includes(player.id) &&
        stringContainsString(getPlayerFullName(player), filterAutocomplete)
      );
    })
    .filter((player, index, array) => {
      // Shorten the list to not overload the frontend
      return index < 35;
    })
    .map((player) => {
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
    });

  function ButtonEmptyPlayer() {
    return canAddNewPlayer ? (
      <Button
        className="w-full whitespace-normal"
        onPress={() => {
          setAutocompleteKey((prev) => prev + 1);
          setShowModalCreatePlayer(true);
        }}
      >
        Ajouter un nouveau joueur
      </Button>
    ) : (
      "Aucun joueur trouvé."
    );
  }

  return (
    <>
      <Autocomplete
        key={autocompleteKey}
        label={autocompleteLabel}
        variant="bordered"
        placeholder={autocompletePlaceholder}
        onSelectionChange={(playerId) => {
          if (playerId)
            setSelectedPlayer(players.find((e) => e.id === +playerId)!);
        }}
        isLoading={isLoading}
        defaultSelectedKey={defaultSelectedKey}
        listboxProps={{
          emptyContent: <ButtonEmptyPlayer />,
        }}
        autoFocus={autoFocus}
        size={autocompleteSize}
        onInputChange={setFilterAutocomplete}
      >
        {items}
      </Autocomplete>

      <Modal
        backdrop="blur"
        isOpen={showModalCreatePlayer}
        onClose={() => setShowModalCreatePlayer(false)}
      >
        <ModalContent>
          <div className="p-5 flex flex-col items-center text-center">
            <CreatePlayer />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
