import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../../stores/authContext";

export default function SelectionStats() {
  const router = useRouter();

  const user = useContext(AuthContext);

  let connexion: JSX.Element = <DropdownItem className="hidden"></DropdownItem>;
  let storyTeller: JSX.Element = (
    <DropdownItem className="hidden"></DropdownItem>
  );

  if (user) {
    // Loading
    if (user.isLoading) {
      connexion = (
        <DropdownItem key={"Connecting"} startContent={<Spinner />}>
          Connexion...
        </DropdownItem>
      );
    } else {
      // Data received
      // User connected
      if (user.isConnected) {
        connexion = (
          <DropdownItem key="/api/auth/signout" showDivider>
            Se déconnecter
          </DropdownItem>
        );
        // User is StoryTeller
        if (user.isStoryTeller) {
          storyTeller = (
            <DropdownSection title="Espace conteur" className="mb-0">
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
              <DropdownItem key="/update/games">
                Modifier une partie
              </DropdownItem>
              <DropdownItem key="/update/editions">
                Modifier un module
              </DropdownItem>
              <DropdownItem key="/update/roles">Modifier un rôle</DropdownItem>
              <DropdownItem key="/update/players" showDivider>
                Modifier un joueur
              </DropdownItem>
            </DropdownSection>
          );
        }
      }
      // User not connected
      else {
        connexion = (
          <DropdownItem key="/api/auth/signin" showDivider>
            Se connecter
          </DropdownItem>
        );
      }
    }
  }

  return (
    <div className="mb-2.5">
      <Dropdown type="menu">
        <DropdownTrigger>
          <Button>Selection stat</Button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={[router.asPath, "/games-role", "Connecting"]}
          onAction={(key) => {
            router.push(key.toString());
          }}
          aria-label="Static Actions"
        >
          {connexion}
          {storyTeller}
          <DropdownItem key="/games-player">
            Nombre de parties par joueur
          </DropdownItem>
          <DropdownItem showDivider key="/games-role">
            Nombre de parties par rôle
          </DropdownItem>
          <DropdownItem key="/games">Liste des parties</DropdownItem>
          <DropdownItem key="/editions">Liste des modules</DropdownItem>
          <DropdownItem key="/roles">Liste des rôles</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
