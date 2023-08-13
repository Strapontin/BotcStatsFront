import { Role } from "@/entities/Role";
import { Fragment, useEffect, useRef, useState } from "react";
import Classes from "./RolesSelector.module.css";
import { Button, Input, Spacer } from "@nextui-org/react";
import { X } from "react-feather";
import ListItemRole from "../list-stats/ListItemRole";
import { getAllRoles } from "../../../data/back-api/back-api";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function RolesSelector(props: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  placeholderText: string;
  rolesInSelectedEdition?: Role[];
}) {
  const inputFilterRole = useRef<HTMLInputElement>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [visibleRoles, setVisibleRoles] = useState<Role[]>([]);

  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    async function initRoles() {
      // if roles are passed in prop, use them
      if (props.rolesInSelectedEdition !== undefined) {
        setAllRoles(props.rolesInSelectedEdition);
        setVisibleRoles(props.rolesInSelectedEdition);
      } else {
        const tempRoles = await getAllRoles();
        setAllRoles(tempRoles);
        setVisibleRoles(tempRoles);
      }
    }
    initRoles();
  }, [props.rolesInSelectedEdition]);

  function onChangeInput(value: string) {
    reSetVisibleRolesFromValue(value);
  }

  function reSetVisibleRolesFromValue(value: string) {
    const visibleRolesToSet = allRoles.filter(
      (r) =>
        toLowerRemoveDiacritics(r.name).includes(
          toLowerRemoveDiacritics(value)
        ) && !props.selectedRoles.map((sr) => sr.id).includes(r.id)
    );
    setVisibleRoles(visibleRolesToSet);
    setFilter(value);
  }

  function onSelectRole(idRoleSelected: number) {
    const roleSelected = visibleRoles.find(
      (role) => role.id === idRoleSelected
    );

    if (roleSelected !== undefined) {
      const roles = props.selectedRoles;
      roles.push(roleSelected);
      props.setSelectedRoles(roles);

      setVisibleRoles(
        visibleRoles.filter((role) => role.id !== idRoleSelected)
      );

      setShowRoles(false);
      setFilter("");
    }
  }

  function removeSelectedRole(id: number) {
    const roleSelected = props.selectedRoles.find((role) => role.id == id);

    if (roleSelected !== undefined) {
      const allSelectedroles = props.selectedRoles.filter(
        (role) => role.id !== id
      );
      props.setSelectedRoles(allSelectedroles);

      setVisibleRoles(
        allRoles.filter((ar) => !allSelectedroles.some((sr) => sr.id === ar.id))
      );
    }
  }

  function onFocusInput() {
    reSetVisibleRolesFromValue(filter);
    setShowRoles(true);
  }

  function blurInput(event: any) {
    // Not (selecting a role/clearing input/click around roles) => hide roles
    if (
      event === undefined ||
      event === null ||
      event.relatedTarget === undefined ||
      event.relatedTarget === null ||
      event.relatedTarget.classList === undefined ||
      event.relatedTarget.classList === null ||
      (!event.relatedTarget.classList.contains(Classes["role-item"]) &&
        !event.relatedTarget.classList.contains("nextui-input-clear-button") &&
        !event.relatedTarget.classList.contains(
          Classes["container-roles-values"]
        ))
    ) {
      setShowRoles(false);
    } else if (
      event.relatedTarget.classList.contains("nextui-input-clear-button")
    ) {
      onChangeInput("");
    } else if (
      event.relatedTarget.classList.contains(Classes["container-roles-values"])
    ) {
      inputFilterRole.current?.focus();
    }
  }

  return (
    <Fragment>
      <div className={Classes["roles-selected"]}>
        {props.selectedRoles.map((role) => (
          <Fragment key={role.id}>
            <div className={Classes["role-selected"]}>
              <ListItemRole
                image={role.name}
                characterType={role.characterType}
              />
              <X
                className={Classes.delete}
                onClick={() => removeSelectedRole(role.id)}
              />
            </div>
            <Spacer x={1.25} />
          </Fragment>
        ))}
      </div>
      <div className={Classes["input-container"]}>
        <Input
          css={{ flex: 1 }}
          labelPlaceholder={props.placeholderText}
          aria-label={props.placeholderText}
          clearable
          bordered
          value={filter}
          onChange={(event) => onChangeInput(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusInput(), 0)}
          onBlur={(event) => blurInput(event)}
          ref={inputFilterRole}
        ></Input>
      </div>
      {showRoles && <Spacer y={0.75} />}
      {showRoles && (
        <div tabIndex={0} className={Classes["container-roles-values"]}>
          {visibleRoles.map((role) => (
            <Fragment key={role.id}>
              <Button
                className={Classes["role-item"]}
                onPress={() => onSelectRole(role.id)}
              >
                <ListItemRole
                  image={role.name}
                  characterType={role.characterType}
                />
              </Button>
              <Spacer y={0.75} />
            </Fragment>
          ))}
        </div>
      )}
    </Fragment>
  );
}
