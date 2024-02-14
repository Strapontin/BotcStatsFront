import Image from "next/image";
import { useEffect, useState } from "react";
import amnesiac from "../../public/images/roles-icons/amnesique.png";
import texts from "../data/amnesique-404.json";

export default function NotFoundPage() {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(texts[Math.floor(Math.random() * texts.length)]);
  }, []);

  return (
    <div className="text-left">
      <div className="w-full flex justify-center">
        <Image
          priority
          src={amnesiac}
          alt={"amnesiac"}
          width={200}
          height={200}
        />
      </div>
      <span className="text-3xl">{"Erreur 404, cette page n'existe pas."}</span>
      <br />
      <br />
      <span>{text}</span>
    </div>
  );
}
