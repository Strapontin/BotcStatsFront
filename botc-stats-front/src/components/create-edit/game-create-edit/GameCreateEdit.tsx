import AutocompleteEdition from "@/components/edition-selector/AutocompleteEdition";
import AutocompletePlayer from "@/components/player-selector/AutocompletePlayer";
import RolesSelector from "@/components/roles-selector/RolesSelector";
import {
  useGetEditionById,
  useGetEditions,
} from "@/data/back-api/back-api-edition";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Edition } from "@/entities/Edition";
import { Game } from "@/entities/Game";
import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { dateToStringOrderByFormat } from "@/helper/date";
import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import DropdownAlignment from "../../dropdown-alignment/DropdownAlignment";
import PlayerRolesSelector from "../../player-role-selector/PlayerRolesSelector";

export default function GameCreateEdit(props: {
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
    props.game?.edition?.id
  );

  async function editionSelected(edition: Edition) {
    const newGame = { ...props.game, edition: edition };
    props.setGame(newGame);
  }

  function storyTellerSelected(storyTeller: Player) {
    const newGame = { ...props.game, storyTeller: storyTeller };
    props.setGame(newGame);
  }

  function datePlayedSelected(datePlayed: string) {
    const newGame = { ...props.game, datePlayed: new Date(datePlayed) };
    props.setGame(newGame);
  }

  function notesChanged(notes: string) {
    const newGame = { ...props.game, notes: notes };
    props.setGame(newGame);
  }

  function winningAlignmentChanged(winningAlignment: Alignment) {
    const newGame = { ...props.game, winningAlignment: winningAlignment };
    props.setGame(newGame);
  }

  function selectedPlayerRolesChanged(selectedPlayerRoles: PlayerRole[]) {
    const newGame = { ...props.game, playerRoles: selectedPlayerRoles };
    props.setGame(newGame);
  }

  function selectedDemonBluffsChanged(selectedDemonBluffs: Role[]) {
    const newGame = { ...props.game, demonBluffs: selectedDemonBluffs };
    props.setGame(newGame);
  }

  return (
    <>
      {props.title}
      <Spacer y={4} />
      <AutocompleteEdition
        editions={editions}
        isLoading={isEditionsLoading}
        setSelectedEdition={(edition: Edition) => editionSelected(edition)}
        autocompleteLabel="Edition"
      />
      <Spacer y={1.5} />
      <AutocompletePlayer
        players={players}
        isLoading={isPlayersLoading}
        setSelectedPlayer={storyTellerSelected}
        autocompleteLabel="Conteur"
      />
      <Spacer y={1.5} />
      <Input
        variant="bordered"
        type="date"
        label="Date à laquelle la partie a été jouée"
        aria-label="Date à laquelle la partie a été jouée"
        value={dateToStringOrderByFormat(props.game.datePlayed)}
        onChange={(event) => datePlayedSelected(event.target.value)}
      />
      <Spacer y={1.5} />
      <Textarea
        variant="bordered"
        label="Notes"
        aria-label="Notes"
        value={props.game.notes}
        onChange={(event) => notesChanged(event.target.value)}
      />
      <Spacer y={1.5} />
      <DropdownAlignment
        alignment={props.game.winningAlignment}
        setAlignment={winningAlignmentChanged}
        defaultText="Alignement gagnant"
      />
      <Spacer y={5} />
      <PlayerRolesSelector
        selectedPlayerRoles={props.game.playerRoles}
        // setSelectedPlayerRoles={selectedPlayerRolesChanged}
        roles={edition?.roles}
        allPlayers={players}
        isPlayersLoading={isPlayersLoading}
        isRolesLoading={isEditionByIdLoading}
      />
      <Spacer y={1.5} />
      <RolesSelector
        selectedRoles={props.game.demonBluffs}
        setSelectedRoles={selectedDemonBluffsChanged}
        autocompleteLabel="Demon bluffs"
        roles={edition?.roles}
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={props.btnPressed}
        disabled={props.game.winningAlignment === Alignment.None}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
