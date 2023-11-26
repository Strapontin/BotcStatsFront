import { Player } from "@/entities/Player";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Input, Spacer } from "@nextui-org/react";
import { Fragment, useRef, useState } from "react";
import ListItem from "../list-stats/ListItem";
import Classes from "./PlayerSelector.module.css";

export default function PlayerSelector(props: {
  selectedPlayer: Player;
  setSelectedPlayer: any;
  allPlayers: Player[];
}) {
  const inputFilterPlayer = useRef<HTMLInputElement>(null);
  const [showPlayers, setShowPlayers] = useState(false);
  const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);

  const [filter, setFilter] = useState<string>(props.selectedPlayer.name);

  function reSetVisiblePlayersFromValue(value: string) {
    const visiblePlayersToSet = props.allPlayers.filter(
      (e) =>
        toLowerRemoveDiacritics(e.name).includes(
          toLowerRemoveDiacritics(value)
        ) ||
        toLowerRemoveDiacritics(e.pseudo).includes(
          toLowerRemoveDiacritics(value)
        )
    );
    setVisiblePlayers(visiblePlayersToSet);
    setFilter(value);
  }

  function onChangeInput(value: string) {
    reSetVisiblePlayersFromValue(value);
  }

  function onSelectPlayer(idPlayerSelected: number) {
    const playerSelected = props.allPlayers.find(
      (player) => player.id == idPlayerSelected
    );

    if (playerSelected !== undefined) {
      props.setSelectedPlayer(playerSelected);
      setFilter(playerSelected.name);

      setShowPlayers(false);
    }
  }

  function onFocusInput() {
    reSetVisiblePlayersFromValue(filter);
    setShowPlayers(true);
  }

  function blurInput(event: any) {
    // If an player was selected, set the filter to that player name
    if (props.selectedPlayer !== undefined) {
      setFilter(props.selectedPlayer.name);
    }

    // Not (selecting a player/clearing input/click around players) => hide players
    if (
      event === undefined ||
      event === null ||
      event.relatedTarget === undefined ||
      event.relatedTarget === null ||
      event.relatedTarget.classList === undefined ||
      event.relatedTarget.classList === null ||
      (!event.relatedTarget.classList.contains(Classes["player-item"]) &&
        !event.relatedTarget.classList.contains("nextui-input-clear-button") &&
        !event.relatedTarget.classList.contains(
          Classes["container-players-values"]
        ))
    ) {
      setShowPlayers(false);
    } else if (
      event.relatedTarget.classList.contains("nextui-input-clear-button")
    ) {
      onChangeInput("");
      inputFilterPlayer.current?.focus();
    } else if (
      event.relatedTarget.classList.contains(
        Classes["container-players-values"]
      )
    ) {
      inputFilterPlayer.current?.focus();
    }
  }

  return (
    <>
      <div className={Classes["input-container"]}>
        <Input
          label="Conteur"
          aria-label="Conteur"
          value={filter}
          onChange={(event) => onChangeInput(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusInput(), 0)}
          onBlur={(event) => blurInput(event)}
          ref={inputFilterPlayer}
        />
      </div>
      {showPlayers && <Spacer y={1} />}
      {showPlayers && (
        <div tabIndex={0} className={Classes["container-players-values"]}>
          {visiblePlayers.map((player) => (
            <Fragment key={player.id}>
              <ListItem
                onPress={() => onSelectPlayer(player.id)}
                left={player.name}
                subName={player.pseudo}
              />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
