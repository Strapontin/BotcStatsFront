import EditionCreateEdit from "@/components/create-edit/edition-create-edit/EditionCreateEdit";
import Title from "@/components/ui/title";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import { useState } from "react";

import {
  createNewEdition,
  useGetEditions,
} from "@/data/back-api/back-api-edition";
import { useGetRoles } from "@/data/back-api/back-api-role";
import useApi from "@/data/back-api/useApi";
import { mutate } from "swr";

export default function CreateEdition() {
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());

  const { data: editions, isLoading: isLoadingEditions } = useGetEditions();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const api = useApi();

  const title = <Title>Création d{"'"}un nouveau module</Title>;

  async function createEdition() {
    if (await createNewEdition(edition, api)) {
      mutate(`${api.apiUrl}/Editions`);
      editions.push(edition);
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
