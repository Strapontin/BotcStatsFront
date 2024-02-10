import { getWikiLinkrole } from "@/components/ui/image-role-name";
import { Edition } from "@/entities/Edition";
import { Game } from "@/entities/Game";
import { GameDraft } from "@/entities/GameDraft";
import { Player, getPlayerFullName } from "@/entities/Player";
import { Role } from "@/entities/Role";
import { ListboxItem } from "@nextui-org/react";

export function getListboxItemPlayerDetails(player: Player) {
  return (
    <ListboxItem
      key={"player-details"}
      aria-label="player-details"
      className="w-full"
      href={`/players/${player.id}`}
    >
      Voir les détails du joueur &apos;{getPlayerFullName(player)}&apos;
    </ListboxItem>
  );
}

export function getListboxItemRoleDetails(role: Role) {
  return (
    <ListboxItem
      key={"role-details"}
      aria-label="role-details"
      className="w-full"
      href={`/roles/${role.id}`}
    >
      Voir les détails du rôle &apos;{role.name}&apos;
    </ListboxItem>
  );
}

export function getListboxItemEditionDetails(edition: Edition) {
  return (
    <ListboxItem
      key={"edition-details"}
      aria-label="edition-details"
      className="w-full"
      href={`/editions/${edition.id}`}
    >
      Voir les détails du module &apos;{edition.name}&apos;
    </ListboxItem>
  );
}

export function getListboxItemGameDetails(game: Game) {
  return (
    <ListboxItem
      key={"game-details"}
      aria-label="game-details"
      className="w-full"
      href={`/games/${game.id}`}
    >
      Voir les détails de la partie
    </ListboxItem>
  );
}

export function getListboxItemGameDraftDetails(gameDraft: GameDraft) {
  return (
    <ListboxItem
      key={"gameDraft-details"}
      aria-label="gameDraft-details"
      className="w-full"
      href={`/gamesDraft/${gameDraft.id}`}
    >
      Voir les détails de la partie de rappel
    </ListboxItem>
  );
}

export function getListboxItemRoleWikiLink(role: Role) {
  return (
    <ListboxItem
      key={"wiki-link"}
      aria-label="wiki-link"
      className="w-full"
      onPress={() => window.open(getWikiLinkrole(role.name))}
    >
      Voir le rôle sur le wiki
    </ListboxItem>
  );
}

// Update
export function getListboxItemUpdatePlayer(player: Player, show: boolean) {
  return (
    <ListboxItem
      key={"player-update"}
      aria-label="player-update"
      className={`w-full ${show ? "" : "hidden"}`}
      href={`/update/players/${player.id}`}
    >
      Modifier le joueur &apos;{getPlayerFullName(player)}&apos;
    </ListboxItem>
  );
}

export function getListboxItemUpdateRole(role: Role, show: boolean) {
  return (
    <ListboxItem
      key={"role-update"}
      aria-label="role-update"
      className={`w-full ${show ? "" : "hidden"}`}
      href={`/update/roles/${role.id}`}
    >
      Modifier le rôle &apos;{role.name}&apos;
    </ListboxItem>
  );
}

export function getListboxItemUpdateEdition(edition: Edition, show: boolean) {
  return (
    <ListboxItem
      key={"edition-update"}
      aria-label="edition-update"
      className={`w-full ${show ? "" : "hidden"}`}
      href={`/update/editions/${edition.id}`}
    >
      Modifier le module &apos;{edition.name}&apos;
    </ListboxItem>
  );
}

export function getListboxItemUpdateGame(game: Game, show: boolean) {
  return (
    <ListboxItem
      key={"game-update"}
      aria-label="game-update"
      className={`w-full ${show ? "" : "hidden"}`}
      href={`/update/games/${game.id}`}
    >
      Modifier la partie
    </ListboxItem>
  );
}

export function getListboxItemUpdateGameDraft(
  gameDraft: GameDraft,
  show: boolean
) {
  return (
    <ListboxItem
      key={"gameDraft-update"}
      aria-label="gameDraft-update"
      className={`w-full ${show ? "" : "hidden"}`}
      href={`/update/gamesDraft/${gameDraft.id}`}
    >
      Modifier la partie de rappel
    </ListboxItem>
  );
}
