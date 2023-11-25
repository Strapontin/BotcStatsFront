import { Player, getNewEmptyPlayer } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import ListBoxPlayerRolesComponent from "../list-stats/ListBoxPlayerRolesComponent";
import AutocompletePlayer from "../player-selector/AutocompletePlayer";
import AutocompleteRoles from "../roles-selector/AutocompleteRoles";
import { useState } from "react";

export default function PlayerRolesSelector({
  selectedPlayerRoles,
  roles,
  allPlayers,
  isPlayersLoading,
  isRolesLoading,
}: {
  selectedPlayerRoles: PlayerRole[];
  roles: Role[];
  allPlayers: Player[];
  isPlayersLoading?: boolean;
  isRolesLoading?: boolean;
}) {
  const [player, setPlayer] = useState(getNewEmptyPlayer());

  return (
    <>
      <ListBoxPlayerRolesComponent
        playerRoles={selectedPlayerRoles}
        showBtnDelete
      />
      <div className="flex gap-1">
        <AutocompletePlayer
          players={allPlayers}
          setSelectedPlayer={(p) => setPlayer(p)}
          autocompleteLabel="Joueur"
          isLoading={isPlayersLoading}
        />
        <AutocompleteRoles
          roles={roles}
          selectedRoles={[]}
          setSelectedRoles={() => {}}
          autocompleteLabel="Rôle"
          isLoading={isRolesLoading}
        />
      </div>
    </>
  );
}
