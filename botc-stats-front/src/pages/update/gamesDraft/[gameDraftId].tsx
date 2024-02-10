import GameDraftCreateEdit from "@/components/create-edit/game-draft-create-edit/GameDraftCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deleteGameDraft,
  updateGameDraft,
  useGetGameDraftById,
} from "@/data/back-api/back-api-game-draft";
import useApi from "@/data/back-api/useApi";
import { GameDraft } from "@/entities/GameDraft";
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
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function UpdateGameDraftPage() {
  const router = useRouter();
  const gameDraftId: number = Number(router.query.gameDraftId);

  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);

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
    toastPromise(update, `Mise à jour de la partie...`);

    if (await update) {
      mutateRoutes();

      if (typeof redirectToCreateGame === "boolean" && redirectToCreateGame) {
        router.push(`/create/game?gameDraftId=${gameDraftId}`);
      }
    }
  }

  async function btnDeletePressed() {
    if (await deleteGameDraft(gameDraft.id, api)) {
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
      onClose={() => setPopupDeleteVisible(false)}
    >
      <ModalContent>
        <ModalHeader>
          <span id="modal-title">
            Voulez-vous vraiment supprimer la partie de rappel du{" "}
            <span>{dateToString(gameDraft.datePlayed)}</span> contée par{" '"}
            <span>{getPlayerFullName(oldGameDraft.storyteller)}</span>
            {"' "}?
          </span>
        </ModalHeader>
        <ModalFooter>
          <Button variant="flat" color="danger" onPress={btnDeletePressed}>
            Confirmer
          </Button>
          <Button onPress={() => setPopupDeleteVisible(false)}>Annuler</Button>
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
      <Button color="danger" onPress={() => setPopupDeleteVisible(true)}>
        Supprimer la partie de rappel
      </Button>

      <Spacer y={3} />

      <ModalDeleteGameDraft />
    </>
  );
}
