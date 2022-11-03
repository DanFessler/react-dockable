import React, { createRef, useRef, forwardRef, useEffect } from "react";

const Panel = function ({
  className,
  color,
  data,
  direction,
  children,
  onMount,
}) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) onMount(ref.current);
  }, [ref]);

  function getPropertyName(type, inverse) {
    let isRow = direction === "row";
    if (inverse) isRow = !isRow;

    switch (type) {
      case "size":
        return isRow ? "width" : "height";
      case "minSize":
        return isRow ? "minWidth" : "minHeight";
      case "maxSize":
        return isRow ? "maxWidth" : "maxHeight";
      default:
        return;
    }
  }

  return (
    <div
      className={`pg-panel ${className || ""}`}
      ref={ref}
      style={{
        [getPropertyName("size")]: data.size,
        [getPropertyName("minSize")]: data.minSize,
        [getPropertyName("maxSize")]: data.maxSize || "auto",
        flexGrow: !data.maxSize && data.resize === "stretch" ? "1" : "0",
        backgroundColor: color,
        userSelect: "none",
        display: "flex",
      }}
    >
      {children}
    </div>
  );
};

export default Panel;
