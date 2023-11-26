import classes from "./ListItem.module.scss";

export default function ListItem(props: {
  left: any;
  value?: any;
  subName?: string;
  onPress?: any;
}) {
  var timeStamp: number;
  const clickableClass = props.onPress !== undefined ? classes.clickable : "";

  function onTouchStart(e: any) {
    timeStamp = e.timeStamp;
  }

  function onTouchMove(e: any) {
    timeStamp = NaN;
  }

  function onTouchEnd(e: any) {
    if (!props.onPress) return;
    if (e.timeStamp - timeStamp < 500) {
      props.onPress();
    }
  }

  return (
    <div
      className={classes["list-item"] + " " + clickableClass}
      onClick={props.onPress}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <div className={classes["left-side"]}>
        <span>{props.left}</span>
        <span
          className={classes["subname"]}
          //  size={13}
        >
          {props.subName}
        </span>
      </div>
      <div className={classes["right-element"]}>{props.value}</div>
    </div>
  );
}
