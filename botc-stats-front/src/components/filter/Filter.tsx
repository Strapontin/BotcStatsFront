import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";

export default function Filter(props: {
  filterValue: string;
  setFilter: Dispatch<SetStateAction<string>>;
  placeholder: string;
}) {
  return (
    <div className="p-1">
      <Input
        label={props.placeholder}
        aria-label={props.placeholder}
        value={props.filterValue}
        onChange={(event) => props.setFilter(event.target.value)}
      />
    </div>
  );
}
