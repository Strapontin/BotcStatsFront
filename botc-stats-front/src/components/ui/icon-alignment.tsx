import { Alignment } from "@/entities/enums/alignment";
import Image from "next/image";
import evilImg from "../../../public/images/evil.webp";
import goodImg from "../../../public/images/good.webp";
import classes from "./icon-alignment.module.scss";

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
      className={editable ? classes["editable"] : ""}
      src={image}
      alt="good"
      width={35}
    />
  );
}
