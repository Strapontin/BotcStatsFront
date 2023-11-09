import { Player, getNewEmptyPlayer } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role, getNewEmptyRole } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { X } from "react-feather";
import ListItem from "../list-stats/ListItem";
import ListItemPlayerRole from "../list-stats/ListItemPlayerRole";
import ListItemRole from "../list-stats/ListItemRole";
import Classes from "./PlayerRolesSelector.module.css";
import { Alignment } from "@/entities/enums/alignment";

export default function PlayerRolesSelector(props: {
  selectedPlayerRoles: PlayerRole[];
  setSelectedPlayerRoles: any;
  rolesInSelectedEdition: Role[];
  allPlayers: Player[];
}) {
  const inputFilterPlayer = useRef<HTMLInputElement>(null);
  const [showPlayers, setShowPlayers] = useState(false);
  const [visiblePlayers, setVisiblePlayers] = useState<Player[]>(
    props.allPlayers
  );
  const [playerFilter, setPlayerFilter] = useState("");
  const [playerSelected, setPlayerSelected] = useState<Player>(
    getNewEmptyPlayer()
  );

  const inputFilterRole = useRef<HTMLInputElement>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [visibleRoles, setVisibleRoles] = useState<Role[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [roleSelected, setRoleSelected] = useState<Role>(getNewEmptyRole());

  useEffect(() => {
    // Automatically adding a player role if a player and a role are set
    if (playerSelected.id !== -1 && roleSelected.id !== -1) {
      setPlayerFilter("");
      setRoleFilter("");
      setPlayerSelected(getNewEmptyPlayer());
      setRoleSelected(getNewEmptyRole());
      setVisiblePlayers(props.allPlayers);
      setVisibleRoles(props.rolesInSelectedEdition);

      var allSelectedPlayerRoles = props.selectedPlayerRoles;
      const playerRole: PlayerRole = {
        player: playerSelected,
        role: roleSelected,
        finalAlignment: roleSelected.alignment,
      };

      allSelectedPlayerRoles.push(playerRole);
      props.setSelectedPlayerRoles(allSelectedPlayerRoles);
    }
  }, [playerSelected, roleSelected, props]);

  function removeSelectedPlayerRole(playerId: number, roleId: number) {
    const index = props.selectedPlayerRoles.findIndex(
      (spr) => spr.player.id === playerId && spr.role.id === roleId
    );
    if (index > -1) {
      props.selectedPlayerRoles.splice(index, 1);
    }

    props.setSelectedPlayerRoles(props.selectedPlayerRoles);
  }

  function onFocusPlayerInput() {
    setShowPlayers(true);
    setShowRoles(false);
  }

  function onFocusRoleInput() {
    setShowPlayers(false);
    setShowRoles(true);
    roleFilterChanged(roleFilter); // Usefull to updates the roles for the selected module
  }

  function playerFilterChanged(filter: string) {
    setPlayerFilter(filter);

    setShowPlayers(true);
    setVisiblePlayers(
      props.allPlayers.filter(
        (p) =>
          toLowerRemoveDiacritics(p.name).includes(
            toLowerRemoveDiacritics(filter)
          ) ||
          toLowerRemoveDiacritics(p.pseudo).includes(
            toLowerRemoveDiacritics(filter)
          )
      )
    );
  }

  function roleFilterChanged(filter: string) {
    setRoleFilter(filter);

    setShowRoles(true);
    setVisibleRoles(
      props.rolesInSelectedEdition.filter((r) =>
        toLowerRemoveDiacritics(r.name).includes(
          toLowerRemoveDiacritics(filter)
        )
      )
    );
  }

  function canBlur(event: any, itemClass: string) {
    if (
      event === undefined ||
      event === null ||
      event.relatedTarget === undefined ||
      event.relatedTarget === null ||
      event.relatedTarget.classList === undefined ||
      event.relatedTarget.classList === null
    ) {
      return true;
    }

    if (
      event.relatedTarget.classList.contains(itemClass) &&
      !event.relatedTarget.classList.contains("nextui-input-clear-button") &&
      !event.relatedTarget.classList.contains(
        Classes["container-players-values"]
      ) &&
      !event.relatedTarget.classList.contains(Classes["container-roles-values"])
    ) {
      return false;
    } else if (
      event.relatedTarget.classList.contains("nextui-input-clear-button")
    ) {
      return false;
    } else if (
      event.relatedTarget.classList.contains(Classes["container-roles-values"])
    ) {
      return false;
    }

    return true;
  }

  function blurPlayerInput(event: any) {
    if (!canBlur(event, Classes["player-item"])) {
      inputFilterPlayer.current?.focus();
    } else {
      setShowPlayers(false);
    }
  }

  function blurRoleInput(event: any) {
    if (!canBlur(event, Classes["role-item"])) {
      inputFilterRole.current?.focus();
    } else {
      setShowRoles(false);
    }
  }

  function onSelectPlayer(playerId: number) {
    const playerSelected = props.allPlayers.find((p) => p.id === playerId);

    if (playerSelected !== undefined) {
      setPlayerSelected(playerSelected);
      setPlayerFilter(playerSelected.name);
      setShowPlayers(false);
      inputFilterRole.current?.focus();
    }
  }

  function onSelectRole(roleId: number) {
    const roleSelected = props.rolesInSelectedEdition.find(
      (r) => r.id === roleId
    );

    if (roleSelected !== undefined) {
      setRoleSelected(roleSelected);
      setRoleFilter(roleSelected.name);
      setShowRoles(false);
      inputFilterPlayer.current?.focus();
    }
  }

  function iconAlignmentClicked(playerRole: PlayerRole) {
    props.selectedPlayerRoles.map((pr) => {
      if (pr.player === playerRole.player && pr.role === playerRole.role) {
        pr.finalAlignment =
          pr.finalAlignment === Alignment.Good
            ? Alignment.Evil
            : Alignment.Good;
      }
      props.setSelectedPlayerRoles(props.selectedPlayerRoles);
    });
  }

  return (
    <>
      <div className={Classes["players-roles-selected"]}>
        {props.selectedPlayerRoles.map((pr, index) => (
          <Fragment key={pr.player.id + "-" + pr.role.id + "-" + index}>
            <div className={Classes["player-role-selected"]}>
              <ListItemPlayerRole
                playerRole={pr}
                iconAlignmentClicked={() => iconAlignmentClicked(pr)}
              />
              <X
                className={Classes.delete}
                onClick={() =>
                  removeSelectedPlayerRole(pr.player.id, pr.role.id)
                }
              />
            </div>
            <Spacer x={1.25} />
          </Fragment>
        ))}
      </div>
      <Spacer x={2} />
      <div className={Classes["inputs-container"]}>
        <Input
          css={{ flex: 1 }}
          labelPlaceholder="Joueur"
          aria-label="Joueur"
          clearable
          bordered
          value={playerFilter}
          onChange={(event) => playerFilterChanged(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusPlayerInput(), 0)}
          onBlur={(event) => blurPlayerInput(event)}
          ref={inputFilterPlayer}
        ></Input>
        <Input
          css={{ flex: 1 }}
          labelPlaceholder="Rôle"
          aria-label="Rôle"
          clearable
          bordered
          value={roleFilter}
          onChange={(event) => roleFilterChanged(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusRoleInput(), 0)}
          onBlur={(event) => blurRoleInput(event)}
          ref={inputFilterRole}
        ></Input>
      </div>
      {(showPlayers || showRoles) && <Spacer y={0.75} />}
      {showPlayers && (
        // tabIndex are necessary to catch the class in the blur event of the inputs
        <div tabIndex={0} className={Classes["container-players-values"]}>
          {visiblePlayers.map((p) => (
            <div tabIndex={1} key={p.id} className={Classes["player-item"]}>
              <ListItem
                left={p.name}
                subName={p.pseudo}
                onPress={() => onSelectPlayer(p.id)}
              />
              <Spacer y={1} />
            </div>
          ))}
        </div>
      )}
      {showRoles && (
        // tabIndex are necessary to catch the class in the blur event of the inputs
        <div tabIndex={0} className={Classes["container-roles-values"]}>
          {visibleRoles.map((r) => (
            <Fragment key={r.id}>
              <Button
                tabIndex={1}
                className={Classes["role-item"]}
                onPress={() => onSelectRole(r.id)}
              >
                <ListItemRole image={r.name} characterType={r.characterType} />
              </Button>
              <Spacer y={1} />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
