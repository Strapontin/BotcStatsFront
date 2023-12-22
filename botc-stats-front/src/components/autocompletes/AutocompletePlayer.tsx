import { Player, getPlayerFullName } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
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
  players,
  isLoading,
  setSelectedPlayer,
  autocompleteLabel,
  autocompletePlaceholder,
  defaultSelectedKey,
  canAddNewPlayer,
  autoFocus,
}: {
  players: Player[];
  isLoading?: boolean;
  setSelectedPlayer: (player: Player) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
  defaultSelectedKey?: string;
  canAddNewPlayer?: boolean;
  autoFocus?: boolean;
}) {
  const [autocompleteKey, setAutocompleteKey] = useState<number>(0);
  const [showModalCreatePlayer, setShowModalCreatePlayer] =
    useState<boolean>(false);

  const playersSorted = isLoading
    ? []
    : players.sort((a, b) =>
        toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
          ? -1
          : 1
      );

  const items = playersSorted.map((player) => {
    return (
      <AutocompleteItem key={player.id} aria-label={getPlayerFullName(player)}>
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
          setSelectedPlayer(players.find((e) => e.id === +playerId)!);
        }}
        isLoading={isLoading}
        defaultSelectedKey={defaultSelectedKey}
        listboxProps={{
          emptyContent: <ButtonEmptyPlayer />,
        }}
        autoFocus={autoFocus}
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
