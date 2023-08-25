import { Dropdown } from "@nextui-org/react";
import classes from "./SelectionStats.module.css";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../../stores/authContext";

export default function SelectionStats() {
  const router = useRouter();

  const user = useContext(AuthContext);

  let connexionBlock = (
    <Dropdown.Item css={{ display: "none" }}>
      null
    </Dropdown.Item>
  );
  let storyTellerAuthorize = (
    <Dropdown.Item css={{ display: "none" }}>
      null
    </Dropdown.Item>
  );

  if (user && user.accessToken) {
    storyTellerAuthorize = (
      <Dropdown.Item key="/api/auth/signout">Se déconnecter</Dropdown.Item>
    );

    if (user.isStoryTeller) {
      connexionBlock = (
        <Dropdown.Section>
          <Dropdown.Item key="/create/game">
            Ajouter une nouvelle partie
          </Dropdown.Item>
          <Dropdown.Item key="/create/edition">
            Ajouter un nouveau module
          </Dropdown.Item>
          <Dropdown.Item key="/create/role">
            Ajouter un nouveau rôle
          </Dropdown.Item>
          <Dropdown.Item key="/create/player">
            Ajouter un nouveau joueur
          </Dropdown.Item>
          <Dropdown.Item withDivider key="/update/games">
            Modifier une partie
          </Dropdown.Item>
          <Dropdown.Item key="/update/editions">
            Modifier un module
          </Dropdown.Item>
          <Dropdown.Item key="/update/roles">Modifier un rôle</Dropdown.Item>
          <Dropdown.Item key="/update/players">
            Modifier un joueur
          </Dropdown.Item>
        </Dropdown.Section>
      );
    }
  } else {
    connexionBlock = (
      <Dropdown.Item key="/api/auth/signin">Se connecter</Dropdown.Item>
    );
  }

  return (
    <div className={classes.SelectionStats}>
      <Dropdown type="menu">
        <Dropdown.Button id="selection-stat" flat>
          Selection stat
        </Dropdown.Button>
        <Dropdown.Menu
          disabledKeys={[router.asPath, "/games-role"]}
          onAction={(key) => {
            router.push(key.toString());
          }}
          aria-label="Static Actions"
        >
          {storyTellerAuthorize}
          {connexionBlock}
          <Dropdown.Item withDivider key="/games-player">
            Nombre de parties par joueur
          </Dropdown.Item>
          <Dropdown.Item key="/games-role">
            Nombre de parties par rôle
          </Dropdown.Item>
          <Dropdown.Item withDivider key="/games">
            Liste des parties
          </Dropdown.Item>
          <Dropdown.Item key="/editions">Liste des modules</Dropdown.Item>
          <Dropdown.Item key="/roles">Liste des rôles</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
