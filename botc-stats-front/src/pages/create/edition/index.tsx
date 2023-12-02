import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import Title from "@/components/ui/title";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import { useState } from "react";

import { toastPromise } from "@/components/toast/toast";
import {
  createNewEdition,
  useGetEditions,
} from "@/data/back-api/back-api-edition";
import { useGetRoles } from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { mutate } from "swr";

export default function CreateEdition() {
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());

  const { data: editions } = useGetEditions();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const api = useApi();

  const title = <Title>Création d{"'"}un nouveau module</Title>;

  async function createEdition() {
    const createEdition = createNewEdition(edition, api);
    toastPromise(createEdition, "Enregistrement du module...");

    if (await createEdition) {
      mutate(`${api.apiUrl}/Editions`);
      setEdition(getNewEmptyEdition());
    }
  }

  return (
    <EditionCreateEdit
      title={title}
      edition={edition}
      setEdition={setEdition}
      editions={editions}
      roles={roles}
      isLoadingRoles={isLoadingRoles}
      btnPressed={createEdition}
      btnText="Créer un module"
    />
  );
}
