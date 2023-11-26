import PlayerCreateEdit from "@/components/create-edit/player-create-edit/PlayerCreateEdit";
import Title from "@/components/ui/title";
import {
  deletePlayer,
  updatePlayer,
  useGetPlayerById,
  useGetPlayers,
} from "@/data/back-api/back-api-player";
import useApi from "@/data/back-api/useApi";
import {
  Player,
  getNewEmptyPlayer,
  getPlayerPseudoString,
} from "@/entities/Player";
import { stringsAreEqual, toLowerRemoveDiacritics } from "@/helper/string";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Check, XOctagon } from "react-feather";

export default function UpdatePlayerPage() {
  const router = useRouter();
  const playerId: number = Number(router.query.playerId);

  const [oldPlayer, setOldPlayer] = useState<Player>(getNewEmptyPlayer());
  const [disableBtnDelete, setDisableBtnDelete] = useState(false);

  const [playerCreateEditKey, setPlayerCreateEditKey] = useState(0);
  const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
  const [message, setMessage] = useState(<></>);
  // const [players, setPlayers] = useState<Player[]>([]);

  const { data: players } = useGetPlayers();
  const { data: playerData, isLoading } = useGetPlayerById(playerId);
  const [player, setPlayer] = useState<Player>(playerData);
  const api = useApi();

  const canUpdatePlayer = useCallback(() => {
    if (player.name === "") {
      return false;
    } else if (
      players.filter(
        (p: Player) =>
          stringsAreEqual(p.name, player.name) &&
          stringsAreEqual(p.pseudo, player.pseudo)
      ).length !== 0
    ) {
      return false;
    }
  }, [player, players]);

  if (isLoading || !playerId) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  const title = (
    <Title>
      Modification du joueur {`'${oldPlayer.name} (${oldPlayer.pseudo})'`}
    </Title>
  );

  async function btnUpdatePlayer() {
    if (!canUpdatePlayer()) return;

    if (await updatePlayer(player, api)) {
      // const p = useGetPlayerById(playerId);
      // setPlayer(p);
      // setOldPlayer(p);
      setPlayerCreateEditKey(playerCreateEditKey + 1);
    }
  }

  function updateMessage(isError: boolean, message: string) {
    if (message === "") {
      setMessage(<></>);
    } else {
      setMessage(
        <span className={"flex justify-center"}>
          {isError ? <XOctagon /> : <Check />}
          {message}
        </span>
      );
    }
  }

  async function btnDeletePressed() {
    setDisableBtnDelete(true);
    setTimeout(async () => {
      if (await deletePlayer(oldPlayer.id, api)) {
        setPopupDeleteVisible(false);

        setTimeout(() => {
          router.push(
            router.asPath.substring(0, router.asPath.lastIndexOf("/"))
          );
        }, 0);
      }

      setDisableBtnDelete(false);
    }, 0);
  }

  return (
    <>
      <PlayerCreateEdit
        key={playerCreateEditKey}
        title={title}
        player={player}
        setPlayer={setPlayer}
        message={message}
        btnPressed={btnUpdatePlayer}
        btnText="Modifier le joueur"
      />

      <Button
        color="danger"
        onPress={() => setPopupDeleteVisible(true)}
        disabled={disableBtnDelete}
      >
        Supprimer le joueur
      </Button>
      <Spacer y={3} />
      <Modal
        backdrop="blur"
        isOpen={popupDeleteVisible}
        onClose={() => setPopupDeleteVisible(false)}
      >
        <ModalContent>
          <ModalHeader>
            <span id="modal-title">
              Voulez-vous vraiment supprimer le joueur :{" '"}
              <span>
                {oldPlayer.name}
                {getPlayerPseudoString(oldPlayer.pseudo)}
              </span>
              {"' "}?
            </span>
          </ModalHeader>
          <ModalFooter>
            <Button variant="flat" color="danger" onPress={btnDeletePressed}>
              Confirmer
            </Button>
            <Button onPress={() => setPopupDeleteVisible(false)}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
