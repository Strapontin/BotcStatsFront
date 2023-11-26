import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import Title from "@/components/ui/title";
import {
  deletePlayer,
  updatePlayer,
  useGetPlayerById,
  useGetPlayers,
} from "@/data/back-api/back-api-player";
import useApi from "@/data/back-api/useApi";
import { Player, getPlayerFullName } from "@/entities/Player";
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

  const { data: players } = useGetPlayers();
  const { data: playerData, isLoading } = useGetPlayerById(playerId);
  const [player, setPlayer] = useState<Player>(playerData);
  const [oldPlayer, setOldPlayer] = useState<Player>(playerData);
  const api = useApi();

  useEffect(() => {
    setPlayer(playerData);
    setOldPlayer(playerData);
  }, [playerData]);

  if (isLoading || !playerId || !player || !oldPlayer) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (playerData.status === 404) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = (
    <Title>Modification du joueur {getPlayerFullName(oldPlayer)}</Title>
  );

  function canUpdatePlayer() {
    if (
      !player ||
      player.name === "" ||
      players?.some(
        (p: Player) =>
          p.id !== player.id &&
          p.name === player.name &&
          p.pseudo === player.pseudo
      )
    )
      return false;
    return true;
  }

  async function btnUpdatePlayer() {
    if (!canUpdatePlayer()) return;

    if (await updatePlayer(player, api)) {
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
