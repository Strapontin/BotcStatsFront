import classes from "./ListItem.module.css";
import { Text } from "@nextui-org/react";

export default function ListItemTwoValues(props: {
  key1: string;
  key2: string;
  classKey1?: string;
  classKey2?: string;
  value1: string | number;
  value2: string | number;
  classValue1?: string;
  classValue2?: string;
}) {
  return (
    <div className={classes["list-item"]}>
      <div>
        <Text span className={props.classKey1}>
          {props.key1}
        </Text>{" "}
        |{" "}
        <Text span className={props.classKey2}>
          {props.key2}
        </Text>
      </div>
      <div>
        <Text b className={props.classValue1}>
          {props.value1}
        </Text>{" "}
        |{" "}
        <Text b className={props.classValue2}>
          {props.value2}
        </Text>
      </div>
    </div>
  );
}
