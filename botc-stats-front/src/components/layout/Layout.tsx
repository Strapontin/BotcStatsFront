import SelectionStats from "../select-stats/SelectionStats";
import classes from "./Layout.module.css";

export default function Layout(props: { children: any; className: string }) {
  return (
    <div className={classes.Layout + " " + props.className}>
      <div className={classes.header}>
        <SelectionStats />
      </div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
}
