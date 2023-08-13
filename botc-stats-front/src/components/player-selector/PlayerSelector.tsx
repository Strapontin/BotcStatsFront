import { Player } from "@/entities/Player";
import { Fragment, useEffect, useRef, useState } from "react";
import Classes from "./PlayerSelector.module.css";
import { Input, Spacer } from "@nextui-org/react";
import { getAllPlayers } from "../../../data/back-api/back-api";
import Container from "../list-stats/Container";
import ListItem from "../list-stats/ListItem";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function PlayerSelector(props: {
  selectedPlayer: Player;
  setSelectedPlayer: any;
}) {
  const inputFilterPlayer = useRef<HTMLInputElement>(null);
  const [showPlayers, setShowPlayers] = useState(false);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);

  const [filter, setFilter] = useState<string>(props.selectedPlayer.name);

  useEffect(() => {
    async function initPlayers() {
      const tempPlayers = await getAllPlayers();
      setAllPlayers(tempPlayers);
    }
    initPlayers();
  }, []);

  function reSetVisiblePlayersFromValue(value: string) {
    const visiblePlayersToSet = allPlayers.filter(
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
    const playerSelected = allPlayers.find(
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
    <Fragment>
      <div className={Classes["input-container"]}>
        <Input
          css={{ flex: 1 }}
          labelPlaceholder="Conteur"
          aria-label="Conteur"
          clearable
          bordered
          value={filter}
          onChange={(event) => onChangeInput(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusInput(), 0)}
          onBlur={(event) => blurInput(event)}
          ref={inputFilterPlayer}
        />
      </div>
      {showPlayers && <Spacer y={0.75} />}
      {showPlayers && (
        <div tabIndex={0} className={Classes["container-players-values"]}>
          <Container>
            {visiblePlayers.map((player) => (
              <Fragment key={player.id}>
                <ListItem
                  onPress={() => onSelectPlayer(player.id)}
                  name={player.name}
                  subName={player.pseudo}
                />
              </Fragment>
            ))}
          </Container>
        </div>
      )}
    </Fragment>
  );
}
