import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import style from "./Filter.module.scss";

export default function inputFilterPlayer(props: {
  filterValue: string;
  setFilter: Dispatch<SetStateAction<string>>;
  placeholder: string;
}) {
  return (
    <div className={style["filter-container"]}>
      <Input
        className={style["input"]}
        labelPlaceholder={props.placeholder}
        aria-label={props.placeholder}
        clearable
        bordered
        value={props.filterValue}
        onChange={(event) => props.setFilter(event.target.value)}
      />
    </div>
  );
}
