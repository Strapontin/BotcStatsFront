export function SliderX({ children }: { children: JSX.Element }) {
  return (
    <div className="w-full absolute left-0 flex overflow-auto">
      <div style={{ minWidth: "5%", width: "50%" }} />
      {children}
      <div style={{ minWidth: "5%", width: "50%" }} />
    </div>
  );
}
