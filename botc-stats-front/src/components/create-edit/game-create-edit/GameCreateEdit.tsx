import { Edition } from "@/entities/Edition";
import { Fragment, useEffect, useState } from "react";
import { Button, Container, Input, Spacer, Textarea } from "@nextui-org/react";
import { Player } from "@/entities/Player";
import { Alignment } from "@/entities/enums/alignment";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import EditionSelector from "../../edition-selector/EditionSelector";
import PlayerSelector from "../../player-selector/PlayerSelector";
import DropdownAlignment from "../../dropdown-alignment/DropdownAlignment";
import PlayerRolesSelector from "../../player-role-selector/PlayerRolesSelector";
import { Game } from "@/entities/Game";
import { dateToStringOrderByFormat } from "@/helper/date";
import RolesSelector from "@/components/roles-selector/RolesSelector";

export default function GameCreateEdit(props: {
  title: JSX.Element;
  game: Game;
  setGame: any;
  message: JSX.Element;
  btnPressed: any;
  btnText: string;
}) {
  const [rolesInSelectedEdition, setRolesInSelectedEdition] = useState<Role[]>(
    []
  );

  useEffect(() => {
    setRolesInSelectedEdition(props.game.edition.roles);
  }, [props.game]);

  function btnEnabled() {
    // Can create a props.game when
    //  - the edition is set
    //  - the storyTeller is set
    //  - the date is set
    //  - the winningAlignment is set
    return (
      props.game.edition.id !== -1 &&
      props.game.storyTeller.id !== -1 &&
      props.game.winningAlignment !== Alignment.None
    );
  }

  function editionSelected(edition: Edition) {
    const newGame = { ...props.game, edition: edition };
    props.setGame(newGame);
    setRolesInSelectedEdition(edition.roles);
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
    <Fragment>
      {props.title}
      <Spacer y={2} />
      {props.message}
      <Spacer y={2} />
      <Container fluid css={{ display: "flex", flexDirection: "column" }}>
        <EditionSelector
          selectedEdition={props.game.edition}
          setSelectedEdition={(edition: Edition) => editionSelected(edition)}
        />
        <Spacer y={1.75} />
        <PlayerSelector
          selectedPlayer={props.game.storyTeller}
          setSelectedPlayer={storyTellerSelected}
        />
        <Spacer y={0.6} />
        <Input
          css={{ textAlign: "left" }} // Usefull so the label isn't centered
          type="date"
          bordered
          label="Date à laquelle la partie a été jouée"
          aria-label="Date à laquelle la partie a été jouée"
          initialValue={dateToStringOrderByFormat(props.game.datePlayed)}
          onChange={(event) => datePlayedSelected(event.target.value)}
        />
        <Spacer y={1.75} />
        <Textarea
          bordered
          labelPlaceholder="Notes"
          aria-label="Notes"
          initialValue={props.game.notes}
          onChange={(event) => notesChanged(event.target.value)}
        />
        <Spacer y={1.75} />
        <DropdownAlignment
          alignment={props.game.winningAlignment}
          setAlignment={winningAlignmentChanged}
          defaultText="Alignement gagnant"
        />
        <Spacer y={3} />
        <PlayerRolesSelector
          selectedPlayerRoles={props.game.playerRoles}
          setSelectedPlayerRoles={selectedPlayerRolesChanged}
          rolesInSelectedEdition={rolesInSelectedEdition}
        />
        <Spacer y={3} />
        <RolesSelector
          selectedRoles={props.game.demonBluffs}
          setSelectedRoles={selectedDemonBluffsChanged}
          rolesInSelectedEdition={rolesInSelectedEdition}
          placeholderText="Demon bluffs"
        />
        <Spacer y={3} />
      </Container>

      <Button
        shadow
        ghost
        color="success"
        onPress={props.btnPressed}
        disabled={!btnEnabled()}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </Fragment>
  );
}
