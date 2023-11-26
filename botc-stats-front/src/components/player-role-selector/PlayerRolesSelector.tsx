import { Player, getNewEmptyPlayer } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role, getNewEmptyRole } from "@/entities/Role";
import ListBoxPlayerRolesComponent from "../list-stats/ListBoxPlayerRolesComponent";
import AutocompletePlayer from "../player-selector/AutocompletePlayer";
import AutocompleteRoles from "../roles-selector/AutocompleteRoles";
import { useEffect, useState } from "react";

export default function PlayerRolesSelector({
  selectedPlayerRoles,
  roles,
  setSelectedPlayerRoles,
  allPlayers,
  isPlayersLoading,
  isRolesLoading,
}: {
  selectedPlayerRoles: PlayerRole[];
  roles: Role[];
  setSelectedPlayerRoles: (playerRoles: PlayerRole[]) => void;
  allPlayers: Player[];
  isPlayersLoading?: boolean;
  isRolesLoading?: boolean;
}) {
  const [player, setPlayer] = useState<Player>();
  const [role, setRole] = useState<Role>();
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  useEffect(() => {
    if (!player || !role) return;

    const newPlayerRole: PlayerRole = {
      player: player,
      role: role,
      finalAlignment: role.alignment,
    };

    setSelectedPlayerRoles([...selectedPlayerRoles, newPlayerRole]);
    setPlayer(undefined);
    setRole(undefined);
    setAutocompleteKey((oldVal) => oldVal + 1);
  }, [player, role, setSelectedPlayerRoles, selectedPlayerRoles]);

  return (
    <>
      <ListBoxPlayerRolesComponent
        playerRoles={selectedPlayerRoles}
        setSelectedPlayerRoles={setSelectedPlayerRoles}
        showBtnDelete
      />
      <div className="flex gap-1" key={autocompleteKey}>
        <AutocompletePlayer
          players={allPlayers}
          setSelectedPlayer={(p: Player) => setPlayer(p)}
          autocompleteLabel="Joueur"
          isLoading={isPlayersLoading}
        />
        <AutocompleteRoles
          roles={roles}
          selectedRoles={[]}
          setSelectedRoles={(r: Role) => setRole(r)}
          autocompleteLabel="Rôle"
          isLoading={isRolesLoading}
        />
      </div>
    </>
  );
}
