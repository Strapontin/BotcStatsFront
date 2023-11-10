import {
  Alignment,
  alignmentList,
  getAlignmentTextById,
} from "@/entities/enums/alignment";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

export default function DropdownAlignment(props: {
  setAlignment: any;
  alignment: Alignment;
  defaultText?: string;
}) {
  const alignmentText = getAlignmentTextById(
    props.alignment,
    props.defaultText
  );

  function selectAlignment(key: number) {
    props.setAlignment(key);
  }

  return (
    <>
      <Dropdown type="menu">
        <DropdownTrigger>
          <Button>{alignmentText}</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          onAction={(key) => selectAlignment(+key)}
        >
          {alignmentList().map((item) => (
            <DropdownItem key={item.key}>{item.value}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
