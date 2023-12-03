import Filter from "@/components/filter/Filter";
import { getAvatarRole } from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useGetEditionById } from "@/data/back-api/back-api-edition";
import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Listbox, ListboxItem, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function EditionIdPage() {
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const editionId: number = Number(router.query.editionId);

  const { data: edition, isLoading } = useGetEditionById(editionId);

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const filteredRoles = edition.roles.filter((role: Role) =>
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
        {filteredRoles.map((r: Role) => (
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
