import classes from "./Container.module.css";

export default function Container(props: { children: any }) {
  return <div className={classes.container}>{props.children}</div>;
}
