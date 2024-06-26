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
  disabledPlayerIds,
}: {
  setSelectedPlayer: (player: Player) => void;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
  defaultSelectedKey?: string;
  canAddNewPlayer?: boolean;
  autoFocus?: boolean;
  autocompleteSize?: "sm" | "md" | "lg";
  disabledPlayerIds?: number[];
}) {
  const { data: players, isLoading } = useGetPlayers();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(0);
  const [filterAutocomplete, setFilterAutocomplete] = useState<string>("");
  const [showModalCreatePlayer, setShowModalCreatePlayer] =
    useState<boolean>(false);

  const playersSorted = isLoading
    ? []
    : players
        .filter((player) => {
          return stringContainsString(
            getPlayerFullName(player),
            filterAutocomplete
          );
        })
        .sort((a, b) =>
          toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
            ? -1
            : 1
        )
        .filter(
          // Shorten the list to not overload the frontend
          (player, index) => index < 35
        );

  const items = playersSorted.map((player) => (
    <AutocompleteItem key={player.id} aria-label={getPlayerFullName(player)}>
      <div className="flex flex-col">
        <span>{player.name}</span>
        <span className="text-default-400 text-sm">{player.pseudo}</span>
      </div>
    </AutocompleteItem>
  ));

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
        disabledKeys={disabledPlayerIds?.map((id) => `${id}`)}
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
