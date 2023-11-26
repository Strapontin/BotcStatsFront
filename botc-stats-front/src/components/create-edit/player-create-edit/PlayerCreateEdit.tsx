import { Player, getPlayerPseudoString } from "@/entities/Player";
import { stringsAreEqual } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function PlayerCreateEdit(props: {
  title: JSX.Element;
  player: Player;
  setPlayer: any;
  players: Player[];
  btnPressed: any;
  btnText: string;
}) {
  const inputsAreInvalid = props.players?.some(
    (p) =>
      p.id !== props.player.id &&
      stringsAreEqual(p.name, props.player.name) &&
      stringsAreEqual(p.pseudo, props.player.pseudo)
  );

  function playerNameChanged(playerName: string) {
    const newPlayer = { ...props.player, name: playerName };
    props.setPlayer(newPlayer);
  }

  function pseudoChanged(pseudo: string) {
    const newPlayer = { ...props.player, pseudo };
    props.setPlayer(newPlayer);
  }

  return (
    <>
      {props.title}
      <Spacer y={4} />
      <Input
        label="Nom"
        aria-label="Nom"
        value={props.player.name}
        onChange={(event) => playerNameChanged(event.target.value)}
        isRequired
        isInvalid={inputsAreInvalid}
      />
      <Spacer y={2} />
      <Input
        label="Pseudo"
        aria-label="Pseudo"
        value={props.player.pseudo}
        onChange={(event) => pseudoChanged(event.target.value)}
        isInvalid={inputsAreInvalid}
        errorMessage={
          inputsAreInvalid
            ? `Le joueur ${props.player.name} ${getPlayerPseudoString(
                props.player.pseudo
              )} existe déjà`
            : ""
        }
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={props.btnPressed}
        isDisabled={inputsAreInvalid || props.player.name === ""}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
