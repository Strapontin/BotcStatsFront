import { Input } from "@nextui-org/react";

export default function Filter(props: {
  filterValue: string;
  setFilter: (value: string) => void;
  placeholder: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Input
      label={props.placeholder}
      aria-label={props.placeholder}
      size={props.size}
      defaultValue={props.filterValue}
      onChange={(event) => props.setFilter(event.target.value)}
    />
  );
}
