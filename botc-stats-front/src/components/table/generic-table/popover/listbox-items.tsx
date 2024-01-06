import { getWikiLinkrole } from "@/components/ui/image-role-name";
import { Edition } from "@/entities/Edition";
import { Game } from "@/entities/Game";
import { Player, getPlayerFullName } from "@/entities/Player";
import { Role } from "@/entities/Role";
import { ListboxItem } from "@nextui-org/react";
import { NextRouter } from "next/router";

export function getListboxItemPlayerDetails(
  player: Player,
  router: NextRouter
) {
  return (
    <ListboxItem
      key={"player-details"}
      aria-label="player-details"
      className="w-full"
      onPress={() => router.push(`/players/${player.id}`)}
    >
      Voir les détails du joueur &apos;{getPlayerFullName(player)}&apos;
    </ListboxItem>
  );
}

export function getListboxItemRoleDetails(role: Role, router: NextRouter) {
  return (
    <ListboxItem
      key={"role-details"}
      aria-label="role-details"
      className="w-full"
      onPress={() => router.push(`/roles/${role.id}`)}
    >
      Voir les détails du rôle &apos;{role.name}&apos;
    </ListboxItem>
  );
}

export function getListboxItemEditionDetails(
  edition: Edition,
  router: NextRouter
) {
  return (
    <ListboxItem
      key={"edition-details"}
      aria-label="edition-details"
      className="w-full"
      onPress={() => router.push(`/editions/${edition.id}`)}
    >
      Voir les détails du module &apos;{edition.name}&apos;
    </ListboxItem>
  );
}

export function getListboxItemGameDetails(game: Game, router: NextRouter) {
  return (
    <ListboxItem
      key={"game-details"}
      aria-label="game-details"
      className="w-full"
      onPress={() => router.push(`/games/${game.id}`)}
    >
      Voir les détails de la partie
    </ListboxItem>
  );
}

export function getListboxItemRoleWikiLink(role: Role, router: NextRouter) {
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
