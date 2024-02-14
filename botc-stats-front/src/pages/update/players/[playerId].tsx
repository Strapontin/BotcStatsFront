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
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function UpdatePlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const {
    isOpen: popupDeleteVisible,
    onOpen: openPopupDelete,
    onClose: closePopupDelete,
  } = useDisclosure();

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
    const delPlayer = deletePlayer(oldPlayer.id, api);
    toastPromise(
      delPlayer,
      `Suppression du joueur '${getPlayerFullName(oldPlayer)}'`
    );

    closePopupDelete();
    if (await delPlayer) {
      mutateRoutes();
      router.push("/players");
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
      <Button color="danger" onPress={openPopupDelete}>
        Supprimer le joueur
      </Button>

      <Spacer y={3} />

      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={closePopupDelete}
      >
        <ModalContent>
          <ModalHeader>
            {`Voulez-vous vraiment supprimer le joueur : '
              ${getPlayerFullName(oldPlayer)}
              ' ?
            `}
          </ModalHeader>
          <ModalFooter>
            <Button color="danger" onPress={btnDeletePressed}>
              Confirmer
            </Button>
            <Button onPress={closePopupDelete}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
