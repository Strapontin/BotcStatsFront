import AutocompleteEdition from "@/components/autocompletes/AutocompleteEdition";
import AutocompletePlayer from "@/components/autocompletes/AutocompletePlayer";
import { useGetEditions } from "@/data/back-api/back-api-edition";
import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Edition } from "@/entities/Edition";
import { GameDraft } from "@/entities/GameDraft";
import { Player } from "@/entities/Player";
import { dateToStringYMD } from "@/helper/date";
import { Button, Input, Spacer, Textarea } from "@nextui-org/react";

export default function GameDraftCreateEdit({
  title,
  gameDraft,
  setGameDraft,
  btnPressed,
  btnText,
}: {
  title: JSX.Element;
  gameDraft: GameDraft;
  setGameDraft: any;
  btnPressed: any;
  btnText: string;
}) {
  const { data: editions, isLoading: isEditionsLoading } = useGetEditions();

  async function editionSelected(edition: Edition) {
    setGameDraft({ ...gameDraft, edition: edition });
  }
  function storytellerSelected(storyteller: Player) {
    setGameDraft({ ...gameDraft, storyteller: storyteller });
  }
  function datePlayedSelected(datePlayed: string) {
    setGameDraft({ ...gameDraft, datePlayed: new Date(datePlayed) });
  }
  function notesChanged(notes: string) {
    setGameDraft({ ...gameDraft, notes: notes });
  }

  return (
    <>
      {title}
      <Spacer y={4} />
      <AutocompleteEdition
        editions={editions}
        isLoading={isEditionsLoading}
        setSelectedEdition={(edition: Edition) => editionSelected(edition)}
        autocompleteLabel="Module"
        defaultSelectedKey={String(gameDraft?.edition?.id)}
      />
      <Spacer y={1.5} />
      <AutocompletePlayer
        setSelectedPlayer={storytellerSelected}
        autocompleteLabel="Conteur"
        defaultSelectedKey={String(gameDraft?.storyteller?.id)}
      />
      <Spacer y={1.5} />
      <Input
        variant="bordered"
        type="date"
        label="Date à laquelle la partie a été jouée"
        aria-label="Date à laquelle la partie a été jouée"
        value={dateToStringYMD(gameDraft.datePlayed)}
        onChange={(event) => datePlayedSelected(event.target.value)}
      />
      <Spacer y={1.5} />
      <Textarea
        variant="bordered"
        label="Notes"
        aria-label="Notes"
        value={gameDraft.notes}
        onChange={(event) => notesChanged(event.target.value)}
      />
      <Spacer y={1.5} />
      <Textarea
        isReadOnly
        variant="flat"
        color="warning"
        value={
          "Il est possible de mettre les joueurs présents dans les notes, " +
          "mais il est déconseillé de mettre les rôles tant que " +
          "la partie n'est pas terminée (risque de triche)."
        }
      ></Textarea>
      <Spacer y={3} />

      <Button
        color="success"
        onPress={btnPressed}
        isDisabled={
          !gameDraft.edition ||
          gameDraft.edition?.id === -1 ||
          !gameDraft.storyteller ||
          gameDraft.storyteller?.id === -1
        }
      >
        {btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
