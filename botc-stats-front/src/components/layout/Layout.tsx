import { Toaster } from "react-hot-toast";
import SelectionStats from "../select-stats/SelectionStats";
import classes from "./Layout.module.css";

export default function Layout(props: { children: any }) {
  const headerClasses =
    process.env.NEXT_PUBLIC_IS_RECETTE === "True"
      ? classes.header + ` ${classes.recette}`
      : classes.header;
  return (
    <>
      <div className="w-full">
        <Toaster position="bottom-right" reverseOrder={true} />
        <div className={classes.Layout + " w-96 max-w-[90%] flex flex-col"}>
          <div className={headerClasses}>
            <SelectionStats />
          </div>
          <div className={classes.content}>{props.children}</div>
        </div>
      </div>
    </>
  );
}
