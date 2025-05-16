import styles from "./Tab.module.css";
import SortableItem from "../dndkit/SortableItem";

function Tab({
  name,
  selected = true,
  onClick,
  id,
  parentId,
  address,
}: {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  id: string;
  parentId: string;
  address: number[];
}) {
  const radius = 6;

  return (
    <SortableItem
      key={id}
      id={id}
      data={{
        type: "tab",
        parentId,
        address,
      }}
      style={{
        display: "flex",
        minWidth: 0,
        flexShrink: 1,
      }}
    >
      <span
        className={styles.tab + (selected ? " " + styles.selected : "")}
        onPointerDown={onClick}
        onDoubleClick={(e) => {
          console.log("double click", e);
        }}
        title={name}
      >
        <span className={styles.tabNameContainer}>
          <span className={styles.tabName}>{name}</span>
        </span>
        {selected && (
          <>
            <svg
              width={radius}
              height={radius}
              viewBox={`0 0 ${radius} ${radius}`}
              style={{
                position: "absolute",
                bottom: 0,
                right: `-${radius}px`,
              }}
            >
              <defs>
                <mask id="cornerMaskRight">
                  <rect width={radius} height={radius} fill="white" />
                  <circle cx={radius} cy="0" r={radius} fill="black" />
                </mask>
              </defs>
              <rect
                width={radius}
                height={radius}
                fill="var(--headers)"
                mask="url(#cornerMaskRight)"
              />
            </svg>
            <svg
              width={radius}
              height={radius}
              viewBox={`0 0 ${radius} ${radius}`}
              style={{
                position: "absolute",
                bottom: 0,
                left: `-${radius}px`,
              }}
            >
              <defs>
                <mask id="cornerMaskLeft">
                  <rect width={radius} height={radius} fill="white" />
                  <circle cx="0" cy="0" r={radius} fill="black" />
                </mask>
              </defs>
              <rect
                width={radius}
                height={radius}
                fill="var(--headers)"
                mask="url(#cornerMaskLeft)"
              />
            </svg>
          </>
        )}
      </span>
    </SortableItem>
  );
}

export default Tab;
