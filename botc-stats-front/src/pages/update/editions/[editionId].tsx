import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import { toastPromise } from "@/components/toast/toast";
import Title from "@/components/ui/title";
import {
  deleteEdition,
  updateEdition,
  useGetEditionById,
  useGetEditions,
} from "@/data/back-api/back-api-edition";
import { useGetRoles } from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { Edition } from "@/entities/Edition";
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

export default function UpdateEditionPage() {
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);

  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);

  const { data: editionData, isLoading } = useGetEditionById(editionId);
  const { data: editions } = useGetEditions();
  const { data: roles } = useGetRoles();
  const [edition, setEdition] = useState<Edition>(editionData);
  const [oldEdition, setOldEdition] = useState<Edition>(editionData);
  const api = useApi();

  useEffect(() => {
    setEdition(editionData);
    setOldEdition(editionData);
  }, [editionData]);

  if (isLoading || !edition) {
    return (
      <>
        <Spinner />
      </>
    );
  } else if (editionData.status === 404) {
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
    if (await deleteEdition(oldEdition.id, api)) {
      mutateRoutes();

      setTimeout(() => {
        router.push(router.asPath.substring(0, router.asPath.lastIndexOf("/")));
      }, 0);
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
        roles={roles}
      />

      <Button color="danger" onPress={() => setPopupDeleteVisible(true)}>
        Supprimer le module
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
              Voulez-vous vraiment supprimer le module :{" '"}
              <span>{oldEdition.name}</span>
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
