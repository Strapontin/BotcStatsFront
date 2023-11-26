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
  Avatar,
  Spacer,
} from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { X } from "react-feather";
import ListItemRole from "../list-stats/ListItemRole";
import { getRoleIconPath } from "../ui/image-role-name";

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

  function getCssClassesFromCharacterType(characterType: CharacterType): {
    headerClass: string;
    ringColorClass: string;
  } {
    let headingAutocompleteClasses =
      "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small text-slate-800 text-sm font-bold";
    let bgColorClass = "bg-";
    let ringColorClass = "ring-";

    switch (characterType) {
      case CharacterType.Townsfolk:
        headingAutocompleteClasses =
          headingAutocompleteClasses + " text-slate-700 bg-townsfolk";
        ringColorClass = "ring-townsfolk";
        break;
      case CharacterType.Outsider:
        headingAutocompleteClasses =
          headingAutocompleteClasses + " text-slate-300 bg-outsider";
        ringColorClass = "ring-outsider";
        break;
      case CharacterType.Minion:
        headingAutocompleteClasses =
          headingAutocompleteClasses + " text-slate-300 bg-minion";
        ringColorClass = "ring-minion";
        break;
      case CharacterType.Demon:
        headingAutocompleteClasses =
          headingAutocompleteClasses + " text-slate-300 bg-demon";
        ringColorClass = "ring-demon";
        break;
      case CharacterType.Fabled:
        headingAutocompleteClasses =
          headingAutocompleteClasses + " text-slate-300 bg-fabled";
        ringColorClass = "ring-fabled";
        break;
      case CharacterType.Traveller:
        headingAutocompleteClasses =
          headingAutocompleteClasses + " text-slate-300 bg-traveller";
        ringColorClass = "ring-traveller";
        break;

      default:
        break;
    }

    return {
      headerClass: headingAutocompleteClasses,
      ringColorClass: ringColorClass,
    };
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
        classNames={{ listboxWrapper: "max-h-64" }}
        label="Rôles du module"
        variant="bordered"
        placeholder="Sélectionner un rôle"
        scrollShadowProps={{
          visibility: "none",
        }}
      >
        {Object.keys(rolesGroupedByCharacterType).map((characterType) => {
          const cssClasses = getCssClassesFromCharacterType(+characterType);

          return (
            <AutocompleteSection
              key={characterType}
              title={
                characterTypeList().find((c) => c.key === +characterType)?.value
              }
              classNames={{
                heading: cssClasses.headerClass,
              }}
            >
              {rolesGroupedByCharacterType[characterType].map((role) => {
                return (
                  <AutocompleteItem
                    key={role.id}
                    startContent={
                      <Avatar
                        isBordered
                        classNames={{ base: cssClasses.ringColorClass }}
                        radius="sm"
                        src={getRoleIconPath(role.name)}
                      />
                    }
                  >
                    {role.name}
                  </AutocompleteItem>
                );
              })}
            </AutocompleteSection>
          );
        })}
      </Autocomplete>
    </>
  );
}
