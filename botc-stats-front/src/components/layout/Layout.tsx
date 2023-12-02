import SelectionStats from "../select-stats/SelectionStats";
import classes from "./Layout.module.css";

export default function Layout(props: { children: any }) {
  return (
    <div className="w-full">
      <div className={classes.Layout + " w-96 max-w-[90%] flex flex-col"}>
        <div className={classes.header}>
          <SelectionStats />
        </div>
        <div className={classes.content}>{props.children}</div>
      </div>
    </div>
  );
}
