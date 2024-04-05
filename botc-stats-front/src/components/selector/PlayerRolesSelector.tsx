import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role, getDefaultAlignmentFromRole } from "@/entities/Role";
import { useState } from "react";
import { PlayerRoleItem } from "./PlayerRoleItem";

export default function PlayerRolesSelector({
  selectedPlayerRoles,
  setSelectedPlayerRoles,
}: {
  selectedPlayerRoles: PlayerRole[];
  setSelectedPlayerRoles: (playerRoles: PlayerRole[]) => void;
}) {
  return (
    <>
      <div>
        {selectedPlayerRoles.map((playerRole, index) => {
          return (
            <PlayerRoleItem
              key={index}
              playerRole={playerRole}
              playerRoleSelected={(pr: PlayerRole) => {
                const newPR = selectedPlayerRoles;
                newPR[index] = pr;
                setSelectedPlayerRoles(newPR);
              }}
              deleteLine={() => {
                setSelectedPlayerRoles(
                  selectedPlayerRoles.filter((_, i) => i !== index)
                );
              }}
            />
          );
        })}
        <PlayerRoleItem
          playerRoleSelected={(pr: PlayerRole) => {
            setSelectedPlayerRoles([...selectedPlayerRoles, pr]);
          }}
        />
      </div>
    </>
  );
}
