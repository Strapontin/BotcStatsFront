import { Role, groupRolesByCharacterType } from "@/entities/Role";
import {
  CharacterType,
  characterTypeList,
} from "@/entities/enums/characterType";
import { toLowerRemoveDiacritics } from "@/helper/string";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Spacer,
} from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { X } from "react-feather";
import ListItemRole from "../list-stats/ListItemRole";

export default function RolesSelector(props: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  placeholderText: string;
  roles: Role[];
}) {
  const [filter, setFilter] = useState<string>("");

  const reSetVisibleRolesFromValue = useCallback(
    (value: string) => {
      const visibleRolesToSet = props.roles.filter(
        (r) =>
          toLowerRemoveDiacritics(r.name).includes(
            toLowerRemoveDiacritics(value)
          ) && !props.selectedRoles.some((sr) => sr.id === r.id)
      );
      setFilter(value);
    },
    [props.roles, props.selectedRoles]
  );

  useEffect(() => {
    reSetVisibleRolesFromValue(filter);
  }, [filter, reSetVisibleRolesFromValue]);

  function removeSelectedRole(id: number) {
    const roleSelected = props.selectedRoles.find((role) => role.id == id);

    if (roleSelected) {
      const allSelectedRoles = props.selectedRoles.filter(
        (role) => role.id !== id
      );
      props.setSelectedRoles(allSelectedRoles);
    }
  }

  function getHeaderClassFromCharacterType(characterType: CharacterType) {
    const headingAutocompleteClasses =
      "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small text-slate-800 text-sm font-bold";

    switch (characterType) {
      case CharacterType.Townsfolk:
        return headingAutocompleteClasses + " bg-townsfolk text-slate-700";
      case CharacterType.Outsider:
        return headingAutocompleteClasses + " bg-outsider text-slate-300";
      case CharacterType.Minion:
        return headingAutocompleteClasses + " bg-minion text-slate-300";
      case CharacterType.Demon:
        return headingAutocompleteClasses + " bg-demon text-slate-300";
      case CharacterType.Fabled:
        return headingAutocompleteClasses + " bg-fabled text-slate-300";
      case CharacterType.Traveller:
        return headingAutocompleteClasses + " bg-traveller text-slate-300";

      default:
        return headingAutocompleteClasses;
    }
  }

  const rolesGroupedByCharacterType = groupRolesByCharacterType(props.roles);

  return (
    <>
      <div>
        {props.selectedRoles.map((role) => (
          <Fragment key={role.id}>
            <div>
              <ListItemRole
                image={role.name}
                characterType={role.characterType}
              />
              <X tabIndex={0} onClick={() => removeSelectedRole(role.id)} />
            </div>
            <Spacer x={1.5} />
          </Fragment>
        ))}
      </div>
      {props.selectedRoles.some((r) => r) && <Spacer y={1} />}
      <Autocomplete
        label="Rôles du module"
        variant="bordered"
        placeholder="Sélectionner un rôle"
        scrollShadowProps={{
          isEnabled: true,
          visibility: "bottom",
        }}
      >
        {Object.keys(rolesGroupedByCharacterType).map((characterType) => {
          return (
            <AutocompleteSection
              key={characterType}
              title={
                characterTypeList().find((c) => c.key === +characterType)?.value
              }
              classNames={{
                heading: getHeaderClassFromCharacterType(+characterType),
              }}
            >
              {rolesGroupedByCharacterType[characterType].map((role) => {
                return (
                  <AutocompleteItem key={role.id}>{role.name}</AutocompleteItem>
                );
              })}
            </AutocompleteSection>
          );
        })}
      </Autocomplete>
    </>
  );
}
