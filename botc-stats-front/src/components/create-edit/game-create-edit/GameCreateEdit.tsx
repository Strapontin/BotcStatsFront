import AutocompleteEdition from "@/components/autocompletes/AutocompleteEdition";
import AutocompletePlayer from "@/components/autocompletes/AutocompletePlayer";
import RolesSelector from "@/components/selector/RolesSelector";
import {
  useGetEditionById,
  useGetEditions,
} from "@/data/back-api/back-api-edition";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { useGetRoles } from "@/data/back-api/back-api-role";
import { Edition } from "@/entities/Edition";
import { Game } from "@/entities/Game";
import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { CharacterType } from "@/entities/enums/characterType";
import { dateToStringYMD } from "@/helper/date";
import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import DropdownAlignment from "../../dropdowns/DropdownAlignment";
import PlayerRolesSelector from "../../selector/PlayerRolesSelector";

export default function GameCreateEdit({
  title,
  game,
  setGame,
  btnPressed,
  btnText,
}: {
  title: JSX.Element;
  game: Game;
  setGame: any;
  btnPressed: any;
  btnText: string;
}) {
  const { data: editions, isLoading: isEditionsLoading } = useGetEditions();
  const { data: players, isLoading: isPlayersLoading } = useGetPlayers();
  const {
    data: edition,
    isLoading: isEditionByIdLoading,
  }: { data: Edition; isLoading: boolean } = useGetEditionById(
    game?.edition?.id
  );
  const { data: allTravellers } = useGetRoles([CharacterType.Traveller]);

  async function editionSelected(edition: Edition) {
    setGame({ ...game, edition: edition });
  }
  function storytellerSelected(storyteller: Player) {
    setGame({ ...game, storyteller: storyteller });
  }
  function datePlayedSelected(datePlayed: string) {
    setGame({ ...game, datePlayed: new Date(datePlayed) });
  }
  function notesChanged(notes: string) {
    setGame({ ...game, notes: notes });
  }
  function winningAlignmentChanged(winningAlignment: Alignment) {
    setGame({ ...game, winningAlignment: winningAlignment });
  }
  function selectedPlayerRolesChanged(selectedPlayerRoles: PlayerRole[]) {
    setGame({ ...game, playerRoles: selectedPlayerRoles });
  }
  function selectedDemonBluffsChanged(selectedDemonBluffs: Role[]) {
    setGame({ ...game, demonBluffs: selectedDemonBluffs });
  }

  return (
    <>
      {title}
      <Spacer y={4} />
      <AutocompleteEdition
        editions={editions}
        isLoading={isEditionsLoading}
        setSelectedEdition={(edition: Edition) => editionSelected(edition)}
        autocompleteLabel="Module"
        defaultSelectedKey={String(game?.edition?.id)}
      />
      <Spacer y={1.5} />
      <AutocompletePlayer
        players={players}
        isLoading={isPlayersLoading}
        setSelectedPlayer={storytellerSelected}
        autocompleteLabel="Conteur"
        defaultSelectedKey={String(game?.storyteller?.id)}
      />
      <Spacer y={1.5} />
      <Input
        variant="bordered"
        type="date"
        label="Date à laquelle la partie a été jouée"
        aria-label="Date à laquelle la partie a été jouée"
        value={dateToStringYMD(game.datePlayed)}
        onChange={(event) => datePlayedSelected(event.target.value)}
      />
      <Spacer y={1.5} />
      <Textarea
        variant="bordered"
        label="Notes"
        aria-label="Notes"
        value={game.notes}
        onChange={(event) => notesChanged(event.target.value)}
      />
      <Spacer y={1.5} />
      <DropdownAlignment
        alignment={game.winningAlignment}
        setAlignment={winningAlignmentChanged}
        defaultText="Alignement gagnant"
      />
      <Spacer y={5} />
      <PlayerRolesSelector
        selectedPlayerRoles={game.playerRoles}
        setSelectedPlayerRoles={selectedPlayerRolesChanged}
        roles={[...(allTravellers ?? []), ...(edition?.roles ?? [])]}
        allPlayers={players}
        isPlayersLoading={isPlayersLoading}
        isRolesLoading={isEditionByIdLoading}
      />
      <Spacer y={1.5} />
      <RolesSelector
        selectedRoles={game.demonBluffs}
        setSelectedRoles={selectedDemonBluffsChanged}
        autocompleteLabel="Demon bluffs"
        roles={edition?.roles}
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={btnPressed}
        isDisabled={
          game.winningAlignment === Alignment.None ||
          !game.edition ||
          game.edition?.id === -1 ||
          !game.storyteller ||
          game.storyteller?.id === -1
        }
      >
        {btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
