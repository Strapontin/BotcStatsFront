import { Text } from "@nextui-org/react";
import { dateToString } from "../../helper/date";

export default function DateUi(props: { date: Date }) {
  const date = dateToString(props.date);

  return (
    <Text span color="yellow">
      {date}
    </Text>
  );
}
