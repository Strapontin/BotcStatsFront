import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function ConnectionWithAvatar() {
  const user = useUserHasStoryTellerRights();
  const { data: sessionData, status } = useSession();

  const avatarUrl = sessionData?.user?.image;

  const dropdownItems: {
    key: string;
    text: string | JSX.Element;
    onPress?: () => {};
    showStartContentSpinner?: boolean;
    showDivider?: boolean;
  }[] = user.isLoading
    ? [
        {
          key: "connecting",
          text: "Connexion...",
          showStartContentSpinner: true,
        },
      ]
    : user.isConnected
    ? [
        {
          key: "connected-as",
          text: (
            <div>
              Connecté en tant que :
              <br />
              {sessionData?.user?.name}
            </div>
          ),
          showDivider: true,
        },
        {
          key: "signout",
          text: "Se déconnecter",
          onPress: () => signOut({ redirect: false }),
        },
      ]
    : [
        {
          key: "signin",
          text: "Se connecter",
          onPress: () => signIn("discord"),
        },
      ];

  return (
    <Dropdown type="menu">
      <DropdownTrigger>
        {status === "loading" ? (
          <Spinner />
        ) : (
          <Avatar
            as="button"
            className="transition-transform"
            src={avatarUrl!}
          />
        )}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        disabledKeys={["connecting", "connected-as"]}
      >
        {dropdownItems.map((item) => (
          <DropdownItem
            key={item.key}
            textValue={item.key}
            onPress={item.onPress}
            startContent={item.showStartContentSpinner && <Spinner />}
            showDivider={item.showDivider}
          >
            {item.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
