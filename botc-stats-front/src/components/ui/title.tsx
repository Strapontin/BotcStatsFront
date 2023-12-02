import { Spacer } from "@nextui-org/react";

export default function Title(props: any) {
  return (
    <>
      <h1 className="text-4xl">{props.children}</h1>
      <Spacer y={5} />
    </>
  );
}
