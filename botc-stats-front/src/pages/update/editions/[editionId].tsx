import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deleteEdition,
  updateEdition,
  useGetEditions,
} from "@/data/back-api/back-api-edition";
import useApi from "@/data/back-api/useApi";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
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

export default function UpdateEditionPage() {
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);

  const {
    isOpen: popupDeleteVisible,
    onOpen: openPopupDelete,
    onClose: closePopupDelete,
  } = useDisclosure();

  const { data: editions, isLoading } = useGetEditions();
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());
  const [oldEdition, setOldEdition] = useState<Edition>(getNewEmptyEdition());
  const api = useApi();
  const editionData = editions?.find((e: Edition) => e.id === editionId);

  useEffect(() => {
    if (!editionData) return;
    setEdition(editionData);
    setOldEdition(editionData);
  }, [editionData]);

  if (isLoading || !edition || !oldEdition) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (!editionData) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  const title = <Title>Modification du module {`'${oldEdition.name}'`}</Title>;

  async function btnUpdateEdition() {
    const update = updateEdition(edition, api);
    toastPromise(update, `Mise à jour du module '${oldEdition.name}'`);

    if (await update) {
      mutateRoutes();
    }
  }

  async function btnDeletePressed() {
    const delEdition = deleteEdition(oldEdition.id, api);
    toastPromise(delEdition, `Suppression du module '${edition.name}`);

    closePopupDelete();
    if (await delEdition) {
      mutateRoutes();
      router.push("/editions");
    }
  }

  function mutateRoutes() {
    mutate(`${api.apiUrl}/Editions`);
    mutate(`${api.apiUrl}/Editions/${edition.id}`);
  }

  return (
    <>
      <EditionCreateEdit
        title={title}
        edition={edition}
        setEdition={setEdition}
        editions={editions}
        btnPressed={btnUpdateEdition}
        btnText="Modifier le module"
      />

      <Button color="danger" onPress={openPopupDelete}>
        Supprimer le module
      </Button>

      <Spacer y={3} />

      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={closePopupDelete}
      >
        <ModalContent>
          <ModalHeader>
            {`Voulez-vous vraiment supprimer le module : '
              ${oldEdition.name}
              ' ?`}
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
