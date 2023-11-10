import { Spacer } from "@nextui-org/react";
import classes from "./ListItemLarge.module.css";

export default function ListItemLarge(props: { name: string; value: any }) {
  return (
    <div className={classes["list-item-large"]}>
      <span>{props.name}</span>
      <Spacer y={1} />
      <span>{props.value}</span>
    </div>
  );
}
