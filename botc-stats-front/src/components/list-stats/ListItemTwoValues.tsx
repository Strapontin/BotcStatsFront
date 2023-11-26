import classes from "./ListItem.module.scss";

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
        <span className={props.classKey1}>{props.key1}</span> |{" "}
        <span className={props.classKey2}>{props.key2}</span>
      </div>
      <div>
        <span className={props.classValue1}>{props.value1}</span> |{" "}
        <span className={props.classValue2}>{props.value2}</span>
      </div>
    </div>
  );
}
