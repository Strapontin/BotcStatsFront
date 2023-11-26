import { Player } from "@/entities/Player";
import { Button, Input, Spacer } from "@nextui-org/react";

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
    <>
      {props.title}
      <Spacer y={2} />
      {props.message}
      <Spacer y={2} />
      <Input
        label="Nom"
        aria-label="Nom"
        value={props.player.name}
        onChange={(event) => playerNameChanged(event.target.value)}
        isRequired
        isInvalid={true}
      />
      <Spacer y={1.5} />
      <Input
        label="Pseudo"
        aria-label="Pseudo"
        value={props.player.pseudo}
        onChange={(event) => pseudoChanged(event.target.value)}
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={props.btnPressed}
        isDisabled={!canPressButton()}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
