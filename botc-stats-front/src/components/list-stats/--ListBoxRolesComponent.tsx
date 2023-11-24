// import { Role } from "@/entities/Role";
// import { Listbox, ListboxItem } from "@nextui-org/react";
// import { getAvatarRole } from "../ui/image-role-name";

// const classNamesListBoxItem = {
//   title: "text-left font-bold",
// };

// export default function ListBoxRolesComponent({
//   roles,
//   setRoles,
//   hrefRoles,
// }: {
//   roles: Role[];
//   setRoles?: any;
//   hrefRoles?: string;
// }) {
//   return (
//     <Listbox aria-label="Roles">
//       {roles.map((role) => (
//         <ListboxItem
//           key={role.id}
//           startContent={getAvatarRole(role)}
//           classNames={classNamesListBoxItem}
//           href={hrefRoles?.replace("ROLE_ID", String(role.id))}
//         >
//           {role.name}
//         </ListboxItem>
//       ))}
//     </Listbox>
//   );
// }
