import { Role, sortRoles } from "@/entities/Role";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import { X } from "react-feather";
import { getAvatarRole } from "../ui/image-role-name";

export default function ListboxRolesComponent({
  roles,
  setSelectedRoles,
  hrefRoles,
  showDelete,
}: {
  roles: Role[];
  setSelectedRoles?: any;
  hrefRoles?: string;
  showDelete?: boolean;
}) {
  const sortedSelectedRoles = sortRoles(roles);

  function onClickRemoveRole(roleId: number) {
    setSelectedRoles(sortedSelectedRoles.filter((r) => r.id !== roleId));
  }

  return (
    <Listbox aria-label="Rôles">
      {sortedSelectedRoles.map((role) => (
        <ListboxItem
          key={role.id}
          classNames={{ title: "text-left pl-1" }}
          startContent={getAvatarRole(role)}
          href={hrefRoles?.replace("ROLE_ID", String(role.id))}
          endContent={
            showDelete && (
              <Button
                onClick={() => onClickRemoveRole(role.id)}
                isIconOnly
                color="danger"
                aria-label="delete"
                variant="flat"
              >
                <X />
              </Button>
            )
          }
        >
          {role.name}
        </ListboxItem>
      ))}
    </Listbox>
  );
}
