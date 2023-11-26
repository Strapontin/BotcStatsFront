import { Player, getNewEmptyPlayer } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import ListBoxPlayerRolesComponent from "../list-stats/ListBoxPlayerRolesComponent";
import AutocompletePlayer from "../player-selector/AutocompletePlayer";
import AutocompleteRoles from "../roles-selector/AutocompleteRoles";
import { useState } from "react";

export default function PlayerRolesSelector({
  selectedPlayerRoles,
  setSelectedPlayerRoles,
  rolesInSelectedEdition,
  allPlayers,
}: {
  selectedPlayerRoles: PlayerRole[];
  setSelectedPlayerRoles: any;
  rolesInSelectedEdition: Role[];
  allPlayers: Player[];
}) {
  const [player, setPlayer] = useState(getNewEmptyPlayer());

  return (
    <>
      <ListBoxPlayerRolesComponent
        playerRoles={selectedPlayerRoles}
        showBtnDelete
      />
      <div className="flex">
        <AutocompletePlayer
          players={allPlayers}
          selectedPlayer={player}
          setSelectedPlayer={(p) => setPlayer(p)}
          autocompleteLabel="Joueur"
        />
        <AutocompleteRoles
          roles={rolesInSelectedEdition}
          selectedRoles={[]}
          setSelectedRoles={() => {}}
          autocompleteLabel="Rôle"
        />
      </div>
    </>
  );
}
