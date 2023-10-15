import { CharacterType } from "@/entities/enums/characterType";
import { Text } from "@nextui-org/react";
import Link from "next/link";
import ImageIconName from "../ui/image-icon-name";
import Classes from "./ListItem.module.css";

export default function ListItemRole(props: {
  image: string;
  characterType: CharacterType;
  nbWins?: number;
  nbLoses?: number;
  nbGamesPlayed?: number;
  id?: number;
}) {
  const textNbWins =
    props.nbWins !== undefined ? (
      props.nbWins !== undefined && (
        <>
          <Text b className="green">
            {props.nbWins}
          </Text>{" "}
          |{" "}
        </>
      )
    ) : (
      <></>
    );
  const textNbLoses =
    props.nbLoses !== undefined ? (
      props.nbLoses !== undefined && (
        <>
          <Text b className="red">
            {props.nbLoses}
          </Text>{" "}
          |{" "}
        </>
      )
    ) : (
      <></>
    );
  const textNbGamesPlayed =
    props.nbGamesPlayed !== undefined ? (
      props.nbGamesPlayed !== undefined && <Text b>{props.nbGamesPlayed}</Text>
    ) : (
      <></>
    );

  const itemRole = (
    <div className={Classes["list-item"]}>
      <div>
        <ImageIconName
          setNameAtLeftOfImage
          name={props.image}
          characterType={props.characterType}
        />
      </div>
      <div>
        {textNbWins}
        {textNbLoses}
        {textNbGamesPlayed}
      </div>
    </div>
  );

  if (props.id !== undefined) {
    return (
      <Link className={Classes.link} href={`/roles/${props.id}`}>
        {itemRole}
      </Link>
    );
  }

  return itemRole;
}
