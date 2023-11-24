import { Alignment } from "@/entities/enums/alignment";
import Image from "next/image";
import evilImg from "../../../public/images/evil.webp";
import goodImg from "../../../public/images/good.webp";

export default function IconAlignment({
  alignment,
  editable,
}: {
  alignment: Alignment;
  editable: boolean;
}) {
  const image = alignment === Alignment.Good ? goodImg : evilImg;

  return (
    <Image
      className={editable ? "cursor-pointer" : ""}
      src={image}
      alt="good"
      height={35}
      width={35}
    />
  );
}
