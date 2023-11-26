import { Player, getPlayerFullName } from "@/entities/Player";
import { stringsAreEqual } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function PlayerCreateEdit({
  title,
  player,
  setPlayer,
  players,
  btnPressed,
  btnText,
}: {
  title: JSX.Element;
  player: Player;
  setPlayer: any;
  players: Player[];
  btnPressed: any;
  btnText: string;
}) {
  const inputsAreInvalid = players?.some(
    (p) =>
      p.id !== player.id &&
      stringsAreEqual(p.name, player.name) &&
      stringsAreEqual(p.pseudo, player.pseudo)
  );

  function playerNameChanged(playerName: string) {
    const newPlayer = { ...player, name: playerName };
    setPlayer(newPlayer);
  }

  function pseudoChanged(pseudo: string) {
    const newPlayer = { ...player, pseudo };
    setPlayer(newPlayer);
  }

  function getExistingPlayerFullName() {
    const playerFound = players.find(
      (p) =>
        stringsAreEqual(p.name, player.name) &&
        stringsAreEqual(p.pseudo, player.pseudo)
    )!;

    return getPlayerFullName(playerFound);
  }

  return (
    <>
      {title}
      <Spacer y={4} />
      <Input
        label="Nom"
        aria-label="Nom"
        value={player.name}
        onChange={(event) => playerNameChanged(event.target.value)}
        isRequired
        isInvalid={inputsAreInvalid}
      />
      <Spacer y={2} />
      <Input
        label="Pseudo"
        aria-label="Pseudo"
        value={player.pseudo}
        onChange={(event) => pseudoChanged(event.target.value)}
        isInvalid={inputsAreInvalid}
        errorMessage={
          inputsAreInvalid
            ? `Le joueur '${getExistingPlayerFullName()}' existe déjà`
            : ""
        }
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={btnPressed}
        isDisabled={inputsAreInvalid || !player.name}
      >
        {btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
