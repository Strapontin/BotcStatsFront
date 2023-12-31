import { Input } from "@nextui-org/react";

export default function Filter(props: {
  filterValue: string;
  setFilter: (value: string) => void;
  placeholder: string;
}) {
  return (
    <Input
      label={props.placeholder}
      aria-label={props.placeholder}
      defaultValue={props.filterValue}
      onChange={(event) => props.setFilter(event.target.value)}
    />
  );
}
