import classes from "./ListItemLarge.module.css";
import { Spacer, Text } from "@nextui-org/react";

export default function ListItemLarge(props: { name: string; value: any }) {
  return (
    <div className={classes["list-item-large"]}>
      <Text span>{props.name}</Text>
      <Spacer y={1} />
      <Text span>{props.value}</Text>
    </div>
  );
}
