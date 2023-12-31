import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deletePlayer,
  updatePlayer,
  useGetPlayers,
} from "@/data/back-api/back-api-player";
import useApi from "@/data/back-api/useApi";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerFullName,
} from "@/entities/Player";
import NotFoundPage from "@/pages/404";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function UpdatePlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);

  const { data: players, isLoading } = useGetPlayers();
  const [player, setPlayer] = useState<Player>(getNewEmptyPlayer());
  const [oldPlayer, setOldPlayer] = useState<Player>(getNewEmptyPlayer());
  const api = useApi();
  const playerData = players?.find((p: Player) => p.id === playerId);

  useEffect(() => {
    if (!playerData) return;
    setPlayer(playerData);
    setOldPlayer(playerData);
  }, [playerData]);

  if (isLoading || !player || !oldPlayer) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (!playerData) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = (
    <Title>Modification du joueur {getPlayerFullName(oldPlayer)}</Title>
  );

  async function btnUpdatePlayer() {
    const update = updatePlayer(player, api);
    toastPromise(
      update,
      `Mise à jour du joueur '${getPlayerFullName(oldPlayer)}'`
    );

    if (await update) {
      mutateRoutes();
    }
  }

  async function btnDeletePressed() {
    if (await deletePlayer(oldPlayer.id, api)) {
      mutateRoutes();

      setTimeout(() => {
        router.push(router.asPath.substring(0, router.asPath.lastIndexOf("/")));
      }, 0);
    }
  }

  function mutateRoutes() {
    mutate(`${api.apiUrl}/Players`);
    mutate(`${api.apiUrl}/Players/${player.id}`);
  }

  return (
    <>
      <PlayerCreateEdit
        title={title}
        player={player}
        setPlayer={setPlayer}
        players={players}
        btnPressed={btnUpdatePlayer}
        btnText="Modifier le joueur"
      />
      <Button color="danger" onPress={() => setPopupDeleteVisible(true)}>
        Supprimer le joueur
      </Button>

      <Spacer y={3} />

      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={() => setPopupDeleteVisible(false)}
      >
        <ModalContent>
          <ModalHeader>
            <span id="modal-title">
              Voulez-vous vraiment supprimer le joueur :{" '"}
              <span>{getPlayerFullName(oldPlayer)}</span>
              {"' "}?
            </span>
          </ModalHeader>
          <ModalFooter>
            <Button color="danger" onPress={btnDeletePressed}>
              Confirmer
            </Button>
            <Button onPress={() => setPopupDeleteVisible(false)}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
