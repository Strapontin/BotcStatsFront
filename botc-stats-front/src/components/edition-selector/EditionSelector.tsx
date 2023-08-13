import { Edition } from "@/entities/Edition";
import { Fragment, useEffect, useRef, useState } from "react";
import Classes from "./EditionSelector.module.css";
import { Input, Spacer } from "@nextui-org/react";
import { getAllEditions } from "../../../data/back-api/back-api";
import Container from "../list-stats/Container";
import ListItem from "../list-stats/ListItem";
import { toLowerRemoveDiacritics } from "@/helper/string";

export default function EditionSelector(props: {
  selectedEdition: Edition;
  setSelectedEdition: any;
}) {
  const inputFilterEdition = useRef<HTMLInputElement>(null);
  const [showEditions, setShowEditions] = useState(false);
  const [allEditions, setAllEditions] = useState<Edition[]>([]);
  const [visibleEditions, setVisibleEditions] = useState<Edition[]>([]);

  const [filter, setFilter] = useState<string>(props.selectedEdition.name);

  useEffect(() => {
    async function initEditions() {
      const tempEditions = await getAllEditions();
      setAllEditions(tempEditions);
    }
    initEditions();
  }, []);

  function reSetVisibleEditionsFromValue(value: string) {
    const visibleEditionsToSet = allEditions.filter((e) =>
      toLowerRemoveDiacritics(e.name).includes(toLowerRemoveDiacritics(value))
    );
    setVisibleEditions(visibleEditionsToSet);
    setFilter(value);
  }

  function onChangeInput(value: string) {
    reSetVisibleEditionsFromValue(value);
  }

  function onSelectEdition(idEditionSelected: number) {
    const editionSelected = allEditions.find(
      (edition) => edition.id == idEditionSelected
    );

    if (editionSelected !== undefined) {
      props.setSelectedEdition(editionSelected);
      setFilter(editionSelected.name);

      setShowEditions(false);
    }
  }

  function onFocusInput() {
    reSetVisibleEditionsFromValue(filter);
    setShowEditions(true);
  }

  function blurInput(event: any) {
    // If an edition was selected, set the filter to that edition name
    if (props.selectedEdition !== undefined) {
      setFilter(props.selectedEdition.name);
    }

    // Not (selecting a edition/clearing input/click around editions) => hide editions
    if (
      event === undefined ||
      event === null ||
      event.relatedTarget === undefined ||
      event.relatedTarget === null ||
      event.relatedTarget.classList === undefined ||
      event.relatedTarget.classList === null ||
      (!event.relatedTarget.classList.contains(Classes["edition-item"]) &&
        !event.relatedTarget.classList.contains("nextui-input-clear-button") &&
        !event.relatedTarget.classList.contains(
          Classes["container-editions-values"]
        ))
    ) {
      setShowEditions(false);
    } else if (
      event.relatedTarget.classList.contains("nextui-input-clear-button")
    ) {
      onChangeInput("");
    } else if (
      event.relatedTarget.classList.contains(
        Classes["container-editions-values"]
      )
    ) {
      inputFilterEdition.current?.focus();
    }
  }

  return (
    <Fragment>
      <div className={Classes["input-container"]}>
        <Input
          css={{ flex: 1 }}
          labelPlaceholder="Module"
          aria-label="Module"
          clearable
          bordered
          value={filter}
          onChange={(event) => onChangeInput(event.target.value)}
          onFocus={(event) => setTimeout(() => onFocusInput(), 0)}
          onBlur={(event) => blurInput(event)}
          ref={inputFilterEdition}
        />
      </div>
      {showEditions && <Spacer y={0.75} />}
      {showEditions && (
        <div tabIndex={0} className={Classes["container-editions-values"]}>
          <Container>
            {visibleEditions.map((edition) => (
              <Fragment key={edition.id}>
                <ListItem
                  onPress={() => onSelectEdition(edition.id)}
                  name={edition.name}
                />
              </Fragment>
            ))}
          </Container>
        </div>
      )}
    </Fragment>
  );
}
