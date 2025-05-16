import Droppable from "./Droppable";

function DroppableDivider({
  address,
  index,
}: {
  address: number[];
  index: number;
}) {
  return (
    <Droppable
      id={`${address.join("-")}-handle-${index}`}
      data={{ type: "insert-panel", address: address.concat(index) }}
      style={{
        width: "calc(100% + 16px)",
        height: "calc(100% + 16px)",
        position: "absolute",
        top: "-8px",
        left: "-8px",
        transition: "all 0.1s ease-in-out",
      }}
      overStyle={{
        backgroundColor: "var(--selected)",
      }}
    />
  );
}

export default DroppableDivider;
