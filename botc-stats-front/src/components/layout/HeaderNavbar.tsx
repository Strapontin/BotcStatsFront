import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import imgRecette from "../../../public/images/Recette.png";
import ConnectionWithAvatar from "../connection-with-avatar/ConnectionWithAvatar";

type MenuItem = { name: string; href: string };

export default function HeaderNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Joueurs", href: "/players" },
    { name: "Rôles", href: "/roles" },
    { name: "Modules", href: "/editions" },
    { name: "Parties", href: "/games" },
  ];
  const menuItemsLeftMenuOnly: MenuItem[] = [
    {
      name: "Ordre de nuit",
      href: "/nightsheet",
    },
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{
        backgroundImage:
          process.env.NEXT_PUBLIC_IS_RECETTE === "True"
            ? `url(${imgRecette.src})`
            : "",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      classNames={{
        item: [
          "data-[active=true]:text-blue-500",
          "data-[active=true]:border-blue-500",
          "data-[active=true]:border-b-2",
        ],
        menuItem: ["data-[active=true]:text-blue-500"],
      }}
    >
      <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      <NavbarBrand>
        <Link href="/" color="foreground">
          BOTC Stats
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link href={item.href} color="foreground">
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <ConnectionWithAvatar />
      </NavbarContent>

      <NavbarMenu>
        {[...menuItems, ...menuItemsLeftMenuOnly].map((item) => (
          <NavbarMenuItem key={item.href} isActive={pathname === item.href}>
            <Link
              href={item.href}
              color="foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
