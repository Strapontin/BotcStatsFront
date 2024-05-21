import { Role } from "./Role";

export interface RoleHistory {
  playerId: number;
  name: string;
  pseudo:string;

  roleHistories?: { role: Role; datePlayed: Date }[];
}
