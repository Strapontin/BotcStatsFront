import GameDraftCreateEdit from "@/components/create-edit/game-draft-create-edit/GameDraftCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deleteGameDraft,
  updateGameDraft,
  useGetGameDraftById,
} from "@/data/back-api/back-api-game-draft";
import useApi from "@/data/back-api/useApi";
import { getGameDisplayName } from "@/entities/Game";
import { GameDraft } from "@/entities/GameDraft";
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

export default function UpdateGameDraftPage() {
  const router = useRouter();
  const gameDraftId: number = Number(router.query.gameDraftId);

  const {
    isOpen: popupDeleteVisible,
    onOpen: openPopupDelete,
    onClose: closePopupDelete,
  } = useDisclosure();

  const { data: gameDraftData, isLoading } = useGetGameDraftById(gameDraftId);
  const [gameDraft, setGameDraft] = useState<GameDraft>(gameDraftData);
  const [oldGameDraft, setOldGameDraft] = useState<GameDraft>(gameDraftData);
  const api = useApi();

  useEffect(() => {
    setGameDraft(gameDraftData);
    setOldGameDraft(gameDraftData);
  }, [gameDraftData]);

  if (isLoading || !gameDraft) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (!gameDraftData?.id) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = <Title>Modification d{"'"}une partie de rappel</Title>;

  async function btnUpdateGameDraft(redirectToCreateGame: boolean = false) {
    const update = updateGameDraft(gameDraft, api);
    toastPromise(update, `Mise à jour de la partie de rappel...`);

    if (await update) {
      mutateRoutes();

      if (typeof redirectToCreateGame === "boolean" && redirectToCreateGame) {
        router.push(`/create/game?gameDraftId=${gameDraftId}`);
      }
    }
  }

  async function btnDeletePressed() {
    const delGameDraft = deleteGameDraft(gameDraft.id, api);
    toastPromise(delGameDraft, `Suppression de la partie de rappel...`);

    closePopupDelete();
    if (await delGameDraft) {
      mutateRoutes();
      router.push("/games");
    }
  }

  function mutateRoutes() {
    mutate(`${api.apiUrl}/GameDrafts`);
    mutate(`${api.apiUrl}/GameDrafts/${gameDraft.id}`);
  }

  const ModalDeleteGameDraft = () => (
    <Modal
      backdrop="blur"
      isOpen={popupDeleteVisible}
      onClose={closePopupDelete}
    >
      <ModalContent>
        <ModalHeader>
          {`Voulez-vous vraiment supprimer la partie de rappel du ${getGameDisplayName(
            gameDraft
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
  );

  return (
    <>
      <GameDraftCreateEdit
        title={title}
        gameDraft={gameDraft}
        setGameDraft={setGameDraft}
        btnPressed={btnUpdateGameDraft}
        btnText="Modifier la partie de rappel"
      />

      <Button
        color="success"
        onPress={() => btnUpdateGameDraft(true)}
        isDisabled={
          !gameDraft.edition ||
          gameDraft.edition?.id === -1 ||
          !gameDraft.storyteller ||
          gameDraft.storyteller?.id === -1
        }
      >
        Enregistrer et transformer en partie réelle
      </Button>
      <Spacer y={3} />
      <Button color="danger" onPress={openPopupDelete}>
        Supprimer la partie de rappel
      </Button>

      <Spacer y={3} />

      <ModalDeleteGameDraft />
    </>
  );
}
