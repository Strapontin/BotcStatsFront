import AutocompleteEdition from "@/components/edition-selector/AutocompleteEdition";
import RolesSelector from "@/components/roles-selector/RolesSelector";
import { Edition } from "@/entities/Edition";
import { Game } from "@/entities/Game";
import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { dateToStringOrderByFormat } from "@/helper/date";
import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { getEditionById } from "../../../../data/back-api/back-api";
import DropdownAlignment from "../../dropdown-alignment/DropdownAlignment";
import PlayerRolesSelector from "../../player-role-selector/PlayerRolesSelector";
import AutocompletePlayer from "@/components/player-selector/AutocompletePlayer";

export default function GameCreateEdit(props: {
  title: JSX.Element;
  game: Game;
  setGame: any;
  message: JSX.Element;
  btnPressed: any;
  btnText: string;
  allEditions: Edition[];
  allPlayers: Player[];
}) {
  const [rolesInSelectedEdition, setRolesInSelectedEdition] = useState<Role[]>(
    []
  );

  async function editionSelected(edition: Edition) {
    const newGame = { ...props.game, edition: edition };

    if (edition) {
      const editionRoles = (await getEditionById(edition.id)).roles;
      setRolesInSelectedEdition(editionRoles);
    } else {
      setRolesInSelectedEdition([]);
    }

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
      <Spacer y={2} />
      {props.message}
      <Spacer y={2} />
      <AutocompleteEdition
        editions={props.allEditions}
        selectedEdition={props.game.edition}
        setSelectedEdition={(edition: Edition) => editionSelected(edition)}
      />
      <Spacer y={1.5} />
      <AutocompletePlayer
        players={props.allPlayers}
        selectedPlayer={props.game.storyTeller}
        setSelectedPlayer={storyTellerSelected}
        autocompleteLabel="Conteur"
        autocompletePlaceholder="Sélectionner un conteur"
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
        setSelectedPlayerRoles={selectedPlayerRolesChanged}
        rolesInSelectedEdition={rolesInSelectedEdition}
        allPlayers={props.allPlayers}
      />
      <Spacer y={1.5} />
      <RolesSelector
        selectedRoles={props.game.demonBluffs}
        setSelectedRoles={selectedDemonBluffsChanged}
        placeholderText="Demon bluffs"
        roles={rolesInSelectedEdition}
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
