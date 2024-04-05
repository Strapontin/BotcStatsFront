import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { PlayerRoleItem } from "./PlayerRoleItem";

export default function PlayerRolesSelector({
  selectedPlayerRoles,
  setSelectedPlayerRoles,
  roles,
}: {
  selectedPlayerRoles: PlayerRole[];
  setSelectedPlayerRoles?: (playerRoles: PlayerRole[]) => void;
  roles?: Role[];
}) {
  const t = setSelectedPlayerRoles ? () => {} : undefined;

  return (
    <>
      <div>
        {selectedPlayerRoles.map((playerRole, index) => {
          return (
            <PlayerRoleItem
              key={index}
              propRoles={roles}
              playerRole={playerRole}
              playerRoleSelected={
                setSelectedPlayerRoles
                  ? (pr: PlayerRole) => {
                      const newPR = selectedPlayerRoles;
                      newPR[index] = pr;
                      setSelectedPlayerRoles(newPR);
                    }
                  : undefined
              }
              deleteLine={
                setSelectedPlayerRoles
                  ? () => {
                      setSelectedPlayerRoles(
                        selectedPlayerRoles.filter((_, i) => i !== index)
                      );
                    }
                  : undefined
              }
            />
          );
        })}
        {setSelectedPlayerRoles && (
          <PlayerRoleItem
            propRoles={roles}
            playerRoleSelected={(pr: PlayerRole) => {
              setSelectedPlayerRoles([...selectedPlayerRoles, pr]);
            }}
          />
        )}
      </div>
    </>
  );
}
