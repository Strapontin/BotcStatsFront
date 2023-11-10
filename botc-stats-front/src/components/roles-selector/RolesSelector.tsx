import { Role } from "@/entities/Role";
import { toLowerRemoveDiacritics } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { X } from "react-feather";
import ListItemRole from "../list-stats/ListItemRole";
import Classes from "./RolesSelector.module.css";

export default function RolesSelector(props: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  placeholderText: string;
  roles: Role[];
}) {
  const inputFilterRole = useRef<HTMLInputElement>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [visibleRoles, setVisibleRoles] = useState<Role[]>(props.roles);

  const [filter, setFilter] = useState<string>("");

  const reSetVisibleRolesFromValue = useCallback(
    (value: string) => {
      const visibleRolesToSet = props.roles.filter(
        (r) =>
          toLowerRemoveDiacritics(r.name).includes(
            toLowerRemoveDiacritics(value)
          ) && !props.selectedRoles.some((sr) => sr.id === r.id)
      );
      setVisibleRoles(visibleRolesToSet);
      setFilter(value);
    },
    [props.roles, props.selectedRoles]
  );

  useEffect(() => {
    reSetVisibleRolesFromValue(filter);
  }, [filter, reSetVisibleRolesFromValue]);

  function onChangeInput(value: string) {
    reSetVisibleRolesFromValue(value);
  }

  function onSelectRole(idRoleSelected: number) {
    const roleSelected = visibleRoles.find(
      (role) => role.id === idRoleSelected
    );

    if (roleSelected) {
      props.selectedRoles.push(roleSelected);
      props.setSelectedRoles(props.selectedRoles);

      inputFilterRole.current?.focus();

      setTimeout(() => {
        setFilter("");
      }, 0);
    }
  }

  function removeSelectedRole(id: number) {
    const roleSelected = props.selectedRoles.find((role) => role.id == id);

    if (roleSelected) {
      const allSelectedRoles = props.selectedRoles.filter(
        (role) => role.id !== id
      );
      props.setSelectedRoles(allSelectedRoles);
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
        !event.relatedTarget.classList.contains(Classes.delete) &&
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
      event.relatedTarget.classList.contains(
        Classes["container-roles-values"]
      ) ||
      event.relatedTarget.classList.contains(Classes.delete)
    ) {
      setTimeout(() => {
        inputFilterRole.current?.focus();
      }, 0);
    }
  }

  return (
    <>
      <div className={Classes["roles-selected"]}>
        {props.selectedRoles.map((role) => (
          <Fragment key={role.id}>
            <div className={Classes["role-selected"]}>
              <ListItemRole
                image={role.name}
                characterType={role.characterType}
              />
              <X
                tabIndex={0}
                className={Classes.delete}
                onClick={() => removeSelectedRole(role.id)}
              />
            </div>
            <Spacer x={1.5} />
          </Fragment>
        ))}
      </div>
      {props.selectedRoles.some((r) => r) && <Spacer y={1} />}
      <div className={Classes["input-container"]}>
        <Input
          // css={{ flex: 1 }}
          label={props.placeholderText}
          aria-label={props.placeholderText}
          value={filter}
          onChange={(event) => onChangeInput(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusInput(), 0)}
          onBlur={(event) => blurInput(event)}
          ref={inputFilterRole}
        ></Input>
      </div>
      {showRoles && <Spacer y={1} />}
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
              <Spacer y={1} />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
