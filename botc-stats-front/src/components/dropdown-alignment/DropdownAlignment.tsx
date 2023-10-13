import {
  Alignment,
  alignmentList,
  getAlignmentTextById,
} from "@/entities/enums/alignment";
import { Dropdown } from "@nextui-org/react";

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
        <Dropdown.Button
          id="selection-stat"
          ghost
          iconRight
          css={{ display: "flex", justifyContent: "left" }}
        >
          {alignmentText}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Static Actions"
          onAction={(key) => selectAlignment(+key)}
        >
          {alignmentList().map((item) => (
            <Dropdown.Item key={item.key}>{item.value}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
