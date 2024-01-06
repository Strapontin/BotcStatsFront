import { Toaster } from "react-hot-toast";
import HeaderNavbar from "./HeaderNavbar";
import classes from "./Layout.module.css";

export default function Layout(props: { children: any }) {
  return (
    <>
      <div className="w-full">
        <Toaster position="bottom-right" reverseOrder={true} />
        <div className={classes.Layout + " w-96 max-w-[90%] flex flex-col"}>
          <div className={classes.header}>
            <HeaderNavbar />
          </div>
          <div className={classes.content}>{props.children}</div>
        </div>
      </div>
    </>
  );
}
