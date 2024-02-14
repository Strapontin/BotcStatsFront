import GameCreateEdit from "@/components/create-edit/game-create-edit/GameCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deleteGame,
  updateGame,
  useGetGameById,
} from "@/data/back-api/back-api-game";
import useApi from "@/data/back-api/useApi";
import { Game, getGameDisplayName } from "@/entities/Game";
import { getPlayerFullName } from "@/entities/Player";
import { dateToString } from "@/helper/date";
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

export default function UpdateGamePage() {
  const router = useRouter();
  const gameId: number = Number(router.query.gameId);

  const {
    isOpen: popupDeleteVisible,
    onOpen: openPopupDelete,
    onClose: closePopupDelete,
  } = useDisclosure();

  const { data: gameData, isLoading } = useGetGameById(gameId);
  const [game, setGame] = useState<Game>(gameData);
  const [oldGame, setOldGame] = useState<Game>(gameData);
  const api = useApi();

  useEffect(() => {
    setGame(gameData);
    setOldGame(gameData);
  }, [gameData]);

  if (isLoading || !game) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (gameData.status === 404) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = <Title>Modification d{"'"}une partie existante</Title>;

  async function btnUpdateGame() {
    const update = updateGame(game, api);
    toastPromise(update, `Mise à jour de la partie...`);

    if (await update) {
      mutateRoutes();
    }
  }

  async function btnDeletePressed() {
    const delGame = deleteGame(game.id, api);
    toastPromise(delGame, `Suppression de la partie...`);

    closePopupDelete();
    if (await delGame) {
      mutateRoutes();
      router.push("/games");
    }
  }

  function mutateRoutes() {
    mutate(`${api.apiUrl}/Games`);
    mutate(`${api.apiUrl}/Games/${game.id}`);
  }

  return (
    <>
      <GameCreateEdit
        title={title}
        game={game}
        setGame={setGame}
        btnPressed={btnUpdateGame}
        btnText="Modifier la partie"
      />

      <Button color="danger" onPress={openPopupDelete}>
        Supprimer la partie
      </Button>

      <Spacer y={3} />

      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={closePopupDelete}
      >
        <ModalContent>
          <ModalHeader>
            {`Voulez-vous vraiment supprimer la partie du ${getGameDisplayName(
              game
            )}
            ?`}
          </ModalHeader>
          <ModalFooter>
            <Button variant="flat" color="danger" onPress={btnDeletePressed}>
              Confirmer
            </Button>
            <Button onPress={closePopupDelete}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
