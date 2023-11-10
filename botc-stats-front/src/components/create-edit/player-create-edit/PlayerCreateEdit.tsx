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
      <div
      //  css={{ display: "flex", flexDirection: "column" }}
      >
        <Input
          label="Nom"
          aria-label="Nom"
          value={props.player.name}
          onChange={(event) => playerNameChanged(event.target.value)}
        />
        <Spacer y={1.5} />
        <Input
          label="pseudo"
          aria-label="pseudo"
          value={props.player.pseudo}
          onChange={(event) => pseudoChanged(event.target.value)}
        />
        <Spacer y={3} />
      </div>

      <Button
        color="success"
        onPress={props.btnPressed}
        disabled={!canPressButton()}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
