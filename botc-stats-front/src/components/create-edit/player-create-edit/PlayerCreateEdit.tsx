import { Player } from "@/entities/Player";
import { Fragment, useEffect, useState } from "react";
import { Button, Container, Input, Spacer, Textarea } from "@nextui-org/react";
import DropdownCharacterType from "@/components/dropdown-character-type/DropdownCharacterType";
import DropdownAlignment from "@/components/dropdown-alignment/DropdownAlignment";
import { CharacterType } from "@/entities/enums/characterType";
import { Alignment } from "@/entities/enums/alignment";

export default function PlayerCreateEdit(props: {
  title: JSX.Element;
  player: Player;
  setPlayer: any;
  message: JSX.Element;
  btnPressed: any;
  btnText: string;
}) {
  function playerNameChanged(playerName: string) {
    const newPlayer = { ...props.player, name: playerName };
    props.setPlayer(newPlayer);
  }

  function pseudoChanged(pseudo: string) {
    const newPlayer = { ...props.player, pseudo };
    props.setPlayer(newPlayer);
  }

  function canPressButton() {
    if (props.player.name === "") {
      return false;
    }
    return true;
  }

  return (
    <Fragment>
      {props.title}
      <Spacer y={2} />
      {props.message}
      <Spacer y={2} />
      <Container fluid css={{ display: "flex", flexDirection: "column" }}>
        <Input
          clearable
          bordered
          labelPlaceholder="Nom"
          aria-label="Nom"
          initialValue={props.player.name}
          onChange={(event) => playerNameChanged(event.target.value)}
        />
        <Spacer y={1.75} />
        <Input
          clearable
          bordered
          labelPlaceholder="pseudo"
          aria-label="pseudo"
          initialValue={props.player.pseudo}
          onChange={(event) => pseudoChanged(event.target.value)}
        />
        <Spacer y={3} />
      </Container>

      <Button
        shadow
        ghost
        color="success"
        onPress={props.btnPressed}
        disabled={!canPressButton()}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </Fragment>
  );
}
