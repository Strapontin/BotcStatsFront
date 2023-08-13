import { CharacterType } from "@/entities/enums/characterType";
import ImageIconName from "../ui/image-icon-name";
import Classes from "./ListItem.module.css";
import { Text } from "@nextui-org/react";
import { Fragment } from "react";
import Link from "next/link";

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
        <Fragment>
          <Text b className="green">
            {props.nbWins}
          </Text>{" "}
          |{" "}
        </Fragment>
      )
    ) : (
      <Fragment />
    );
  const textNbLoses =
    props.nbLoses !== undefined ? (
      props.nbLoses !== undefined && (
        <Fragment>
          <Text b className="red">
            {props.nbLoses}
          </Text>{" "}
          |{" "}
        </Fragment>
      )
    ) : (
      <Fragment />
    );
  const textNbGamesPlayed =
    props.nbGamesPlayed !== undefined ? (
      props.nbGamesPlayed !== undefined && <Text b>{props.nbGamesPlayed}</Text>
    ) : (
      <Fragment />
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
