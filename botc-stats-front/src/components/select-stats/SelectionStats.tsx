import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import classes from "./SelectionStats.module.css";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../../stores/authContext";

export default function SelectionStats() {
  const router = useRouter();

  const user = useContext(AuthContext);

  let connexionBlock = <DropdownItem>null</DropdownItem>;
  let storyTellerAuthorize = <DropdownItem>null</DropdownItem>;

  if (user && user.accessToken) {
    storyTellerAuthorize = (
      <DropdownItem key="/api/auth/signout" showDivider>
        Se déconnecter
      </DropdownItem>
    );

    if (user.isStoryTeller) {
      connexionBlock = (
        <DropdownSection title="Actions de conteur">
          <DropdownItem key="/create/game">
            Ajouter une nouvelle partie
          </DropdownItem>
          <DropdownItem key="/create/edition">
            Ajouter un nouveau module
          </DropdownItem>
          <DropdownItem key="/create/role">
            Ajouter un nouveau rôle
          </DropdownItem>
          <DropdownItem key="/create/player">
            Ajouter un nouveau joueur
          </DropdownItem>
          <DropdownItem showDivider key="/update/games">
            Modifier une partie
          </DropdownItem>
          <DropdownItem key="/update/editions">Modifier un module</DropdownItem>
          <DropdownItem key="/update/roles">Modifier un rôle</DropdownItem>
          <DropdownItem key="/update/players">Modifier un joueur</DropdownItem>
        </DropdownSection>
      );
    }
  } else {
    connexionBlock = (
      <DropdownItem key="/api/auth/signin" showDivider>
        Se connecter
      </DropdownItem>
    );
  }

  return (
    <div className={classes.SelectionStats}>
      <Dropdown type="menu">
        <DropdownTrigger>
          <Button id="selection-stat">Selection stat</Button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={[router.asPath, "/games-role"]}
          onAction={(key) => {
            router.push(key.toString());
          }}
          aria-label="Static Actions"
        >
          {storyTellerAuthorize}
          {connexionBlock}
          <DropdownItem showDivider key="/games-player">
            Nombre de parties par joueur
          </DropdownItem>
          <DropdownItem key="/games-role">
            Nombre de parties par rôle
          </DropdownItem>
          <DropdownItem showDivider key="/games">
            Liste des parties
          </DropdownItem>
          <DropdownItem key="/editions">Liste des modules</DropdownItem>
          <DropdownItem key="/roles">Liste des rôles</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
