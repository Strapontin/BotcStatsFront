import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import useApi from "@/data/back-api/useApi";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { signIn, signOut } from "next-auth/react";
import useSWR from "swr";

export default function ConnectionWithAvatar() {
  const user = useUserHasStoryTellerRights();
  const { accessToken, isLoadingApi } = useApi();
  const { data: discordUserData, isLoading: isLoadingDiscordUserData } = useSWR(
    accessToken ? `https://discord.com/api/users/@me` : "",
    (url: string) =>
      fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      }).then((d) => d.json())
  );

  const avatarUrl =
    user.isConnected && discordUserData?.id && discordUserData?.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUserData?.id}/${discordUserData?.avatar}.png`
      : user.isConnected
      ? "https://cdn.discordapp.com/embed/avatars/0.png"
      : "https://cdn.discordapp.com/embed/avatars/1.png";

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
              {discordUserData?.username}
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
        {isLoadingApi || isLoadingDiscordUserData ? (
          <Spinner />
        ) : (
          <Avatar
            as="button"
            className="transition-transform"
            src={avatarUrl}
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
