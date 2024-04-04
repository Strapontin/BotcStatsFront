import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role, getDefaultAlignmentFromRole } from "@/entities/Role";
import { Spacer } from "@nextui-org/react";
import { useState } from "react";
import AutocompletePlayer from "../autocompletes/AutocompletePlayer";
import AutocompleteRoles from "../autocompletes/AutocompleteRoles";
import { ListboxPlayerRoleComponent } from "../listbox/ListboxPlayerRoleComponent";
import { PlayerRoleItem } from "./PlayerRoleItem";

export default function PlayerRolesSelector({
  selectedPlayerRoles,
  roles,
  setSelectedPlayerRoles,
  isPlayersLoading,
  isRolesLoading,
}: {
  selectedPlayerRoles: PlayerRole[];
  roles: Role[];
  setSelectedPlayerRoles: (playerRoles: PlayerRole[]) => void;
  isPlayersLoading?: boolean;
  isRolesLoading?: boolean;
}) {
  const [player, setPlayer] = useState<Player>();
  const [role, setRole] = useState<Role>();
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [autoFocus, setAutoFocus] = useState<string>();

  function addPlayerRole(p?: Player, r?: Role) {
    const newPlayerRole: PlayerRole = {
      player: p,
      role: r,
      finalAlignment: getDefaultAlignmentFromRole(r),
    };

    setSelectedPlayerRoles([...selectedPlayerRoles, newPlayerRole]);
    setPlayer(undefined);
    setRole(undefined);
    setAutocompleteKey((oldVal) => oldVal + 1);
  }

  return (
    <>
      {selectedPlayerRoles.map((playerRole, index) => {
        return (
          <PlayerRoleItem
            key={index}
            playerRole={playerRole}
            playerRoleSelected={(pr: PlayerRole) => {
              if (!pr.player && !pr.role) {
                setSelectedPlayerRoles(
                  selectedPlayerRoles.filter((spr) => spr !== pr)
                );
              } else {
                const newPR = selectedPlayerRoles;
                newPR[index] = pr
                setSelectedPlayerRoles(newPR);
              }
            }}
            showBtnDelete
            deleteClicked={() =>
              setSelectedPlayerRoles(
                selectedPlayerRoles.filter((pr) => pr === playerRole)
              )
            }
          />
        );
      })}

      {/* <ListboxPlayerRoleComponent
        playerRoles={selectedPlayerRoles}
        setSelectedPlayerRoles={setSelectedPlayerRoles}
        showBtnDelete
      />
      <Spacer y={2} />
      <div className="flex gap-1" key={autocompleteKey}>
        <AutocompletePlayer
          key={`autocompletePlayer_${role?.name}`}
          setSelectedPlayer={(p: Player) => {
            // if (!role) setPlayer(p);
            // else
            addPlayerRole(p, role);
            setAutoFocus("Role");
          }}
          autoFocus={autoFocus === "Player"}
          autocompleteLabel="Joueur"
          canAddNewPlayer
        />
        <AutocompleteRoles
          key={`autocompleteRole_${player?.name}`}
          selectedRoles={[]}
          setSelectedRoles={(r: Role) => {
            // if (!player) setRole(r);
            // else
            addPlayerRole(player, r);
            setAutoFocus("Player");
          }}
          autoFocus={autoFocus === "Role"}
          autocompleteLabel="Rôle"
        />
      </div> */}
    </>
  );
}
