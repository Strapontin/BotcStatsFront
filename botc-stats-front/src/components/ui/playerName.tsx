import { Text } from "@nextui-org/react";

export default function PlayerName(props: { name: string }) {
  return (
    <Text span color="grey">
      {props.name}
    </Text>
  );
}
