import { dateToString } from "../../helper/date";

export default function DateUi(props: { date: Date }) {
  const date = dateToString(props.date);

  return <span color="yellow">{date}</span>;
}
