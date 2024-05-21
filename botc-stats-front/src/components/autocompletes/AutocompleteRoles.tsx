import { useGetRoles } from "@/data/back-api/back-api-role";
import { Role, groupRolesByCharacterType } from "@/entities/Role";
import { characterTypeList } from "@/entities/enums/characterType";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import {
  getAvatarRole,
  getCssClassesFromCharacterType,
} from "../ui/image-role-name";

export default function AutocompleteRoles({
  selectedRoles,
  setSelectedRoles,
  autocompleteLabel,
  autocompletePlaceholder,
  multipleSelection,
  autoRefocus,
  autoFocus,
  autocompleteSize,
  propRoles,
}: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  autocompleteLabel?: string;
  autocompletePlaceholder?: string;
  multipleSelection?: boolean;
  autoRefocus?: boolean;
  autoFocus?: boolean;
  autocompleteSize?: "sm" | "md" | "lg";
  propRoles?: Role[];
}) {
  const { data: getRoles, isLoading } = useGetRoles();
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autocompleteKey === 0) return;
    setTimeout(() => {
      autocompleteRef.current?.focus();
    }, 0);
  }, [autocompleteKey]);

  const roles = propRoles ?? getRoles;
  const rolesGroupedByCharacterType = groupRolesByCharacterType(
    isLoading || !roles ? [] : roles
  );

  function setRoleSelected(roleId: number) {
    const roleSelected = roles.find((r) => r.id === roleId);

    if (multipleSelection) setSelectedRoles([...selectedRoles, roleSelected]);
    else setSelectedRoles(roleSelected);

    if (autoRefocus) setAutocompleteKey((oldVal) => oldVal + 1);
  }

  return (
    <Autocomplete
      key={autocompleteKey}
      ref={autocompleteRef}
      label={autocompleteLabel ?? "Rôles"}
      variant="bordered"
      placeholder={autocompletePlaceholder}
      onSelectionChange={(roleId) => {
        if (roleId) setRoleSelected(+roleId);
      }}
      disabledKeys={selectedRoles.map((sr) => sr.id + "")}
      scrollShadowProps={{
        visibility: "none",
      }}
      inputProps={{ baseRef: autocompleteRef }}
      isLoading={isLoading}
      autoFocus={autoFocus}
      size={autocompleteSize}
    >
      {Object.keys(rolesGroupedByCharacterType).map((characterType) => {
        return (
          <AutocompleteSection
            key={characterType + "-"}
            title={
              characterTypeList().find((c) => c.key === +characterType)?.value
            }
            classNames={{
              heading: getCssClassesFromCharacterType(+characterType)
                .headerClass,
            }}
          >
            {rolesGroupedByCharacterType[characterType].map((role) => {
              return (
                <AutocompleteItem
                  key={role.id}
                  startContent={getAvatarRole(role)}
                >
                  {role.name}
                </AutocompleteItem>
              );
            })}
          </AutocompleteSection>
        );
      })}
    </Autocomplete>
  );
}
