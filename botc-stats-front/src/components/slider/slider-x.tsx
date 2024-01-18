import { useRef } from "react";

export function SliderX({ children }: { children: JSX.Element }) {
  const childrenRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sliderX">
      <div className="w-full absolute left-0 flex overflow-auto">
        <div style={{ minWidth: "5%", width: "50%" }} />
        <div ref={childrenRef} className="flex">
          {children}
        </div>
        <div style={{ minWidth: "5%", width: "50%" }} />
      </div>
      <div style={{ height: `${childrenRef.current?.clientHeight}px` }}></div>
    </div>
  );
}
