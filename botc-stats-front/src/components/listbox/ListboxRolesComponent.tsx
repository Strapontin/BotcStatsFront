import { Role, sortRoles } from "@/entities/Role";
import {
  Button,
  Listbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { X } from "react-feather";
import {
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "../table/generic-table/popover/listbox-items";
import { getUserRole } from "../ui/image-role-name";

export default function ListboxRolesComponent({
  roles,
  setSelectedRoles,
  showDelete,
}: {
  roles: Role[];
  setSelectedRoles?: any;
  showDelete?: boolean;
}) {
  const sortedSelectedRoles = sortRoles(roles);

  function onClickRemoveRole(roleId: number) {
    setSelectedRoles(sortedSelectedRoles.filter((r) => r.id !== roleId));
  }

  function getPopoverContent(role: Role) {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemRoleDetails(role)}
        {getListboxItemRoleWikiLink(role)}
      </Listbox>
    );
  }

  return (
    <>
      {roles.map((role: Role, index) => (
        <Popover key={`${role.id}-${index}`} showArrow>
          <PopoverTrigger>
            <div
              className={[
                "flex",
                "items-center",
                "justify-between",
                "px-1.5",
                "py-1.5",
                "cursor-pointer",
              ].join(" ")}
            >
              <div className="cursor-pointer w-full flex justify-between">
                <div>{getUserRole(role)}</div>
                {showDelete && (
                  <Button
                    onClick={() => onClickRemoveRole(role.id)}
                    isIconOnly
                    color="danger"
                    aria-label="delete"
                    variant="flat"
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent>{getPopoverContent(role)}</PopoverContent>
        </Popover>
      ))}
    </>
  );
}
