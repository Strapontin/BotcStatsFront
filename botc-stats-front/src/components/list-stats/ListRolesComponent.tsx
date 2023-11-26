import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { Listbox, ListboxItem } from "@nextui-org/react";
import IconAlignment from "../ui/icon-alignment";
import ImageIconName, { getAvatarRole } from "../ui/image-role-name";

const classNamesListBoxItem = {
  title: "text-left font-bold",
};

export default function ListRolesComponent({ roles }: { roles: Role[] }) {
  return (
    <Listbox aria-label="Roles">
      {roles.map((role) => (
        <ListboxItem
          key={role.id}
          startContent={getAvatarRole(role)}
          classNames={classNamesListBoxItem}
        >
          {role.name}
        </ListboxItem>
      ))}
    </Listbox>
  );
}
