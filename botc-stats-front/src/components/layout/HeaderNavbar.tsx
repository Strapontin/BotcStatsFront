import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useState } from "react";
import imgRecette from "../../../public/images/Recette.png";
import ConnectionWithAvatar from "../connection-with-avatar/ConnectionWithAvatar";

export default function HeaderNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: { name: string; href: string }[] = [
    { name: "Joueurs", href: "/players" },
    { name: "Rôles", href: "/roles" },
    { name: "Modules", href: "/editions" },
    { name: "Parties", href: "/games" },
  ];

  return (
    <Navbar
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      style={{
        backgroundImage:
          process.env.NEXT_PUBLIC_IS_RECETTE === "True"
            ? `url(${imgRecette.src})`
            : "",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        <Link href="/" color="foreground">
          BOTC Stats
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href}>
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
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link href={item.href} color="foreground">
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
