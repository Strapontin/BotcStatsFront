import { Accordion, AccordionProps } from "@nextui-org/react";

export function MainAccordion({ children, ...accordionProps }: AccordionProps) {
  return (
    <Accordion
      itemClasses={{
        heading: ["bg-stone-950", "rounded-lg", "px-4 my-2"].join(" "),
        indicator: [
          "bg-zinc-800",
          "rounded-full",
          "w-6 h-6",
          "flex justify-center items-center",
        ].join(" "),
      }}
      {...accordionProps}
    >
      {children}
    </Accordion>
  );
}
