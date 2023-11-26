import { getAvatarRole } from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { Edition, getNewEmptyEdition } from "@/entities/Edition";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEditionById } from "../../../data/back-api/back-api";
import Filter from "@/components/filter/Filter";

export default function EditionIdPage() {
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);
  const [edition, setEdition] = useState<Edition>(getNewEmptyEdition());

  useEffect(() => {
    if (!editionId || isNaN(editionId)) return;

    getEditionById(editionId).then((p) => setEdition(p));
  }, [editionId]);

  if (edition.id <= 0) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const filteredRoles = edition.roles.filter((role) =>
    toLowerRemoveDiacritics(role.name).includes(toLowerRemoveDiacritics(filter))
  );

  const classNamesListBoxItem = {
    title: "text-left font-bold",
  };

  return (
    <>
      <Title>{`Rôles du module '${edition.name}'`}</Title>
      <Spacer y={3} />
      <Filter
        filterValue={filter}
        setFilter={setFilter}
        placeholder="Filtre rôle"
      />
      <Listbox aria-label="Rôles">
        {filteredRoles.map((r) => (
          <ListboxItem
            key={r.id}
            startContent={getAvatarRole(r)}
            classNames={classNamesListBoxItem}
          >
            {r.name}
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
