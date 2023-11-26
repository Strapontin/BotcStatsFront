import { CharacterType } from "@/entities/enums/characterType";
import Link from "next/link";
import ImageIconName from "../ui/image-role-name";
import Classes from "./ListItem.module.scss";

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
          <span  className="green">
            {props.nbWins}
          </span>{" "}
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
          <span  className="red">
            {props.nbLoses}
          </span>{" "}
          |{" "}
        </>
      )
    ) : (
      <></>
    );
  const textNbGamesPlayed =
    props.nbGamesPlayed !== undefined ? (
      props.nbGamesPlayed !== undefined && <span >{props.nbGamesPlayed}</span>
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
