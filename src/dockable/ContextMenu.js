import React, { useEffect, useRef, useState } from "react";
import css from "./css/ContextMenu.module.css";

// TODO:
// handle bool is unused or unfinished

function ContextMenu({ left, top, actions, onClickOut }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let [x, y] = [0, 0];
    let menuBox = containerRef.current.getBoundingClientRect();
    let viewPort = { width: window.innerWidth, height: window.innerHeight };

    if (left + menuBox.width > viewPort.width) {
      x -= left + menuBox.width - viewPort.width;
    }
    if (top + menuBox.height > viewPort.height) {
      y -= top + menuBox.height - viewPort.height;
    }

    setOffset({ x, y });
  }, [containerRef, left, top]);

  function handleClickOut(e) {
    onClickOut();
  }

  function handleAction(action) {
    action();
    onClickOut();
  }

  function handleSelection(callback, i) {
    callback(i);
    onClickOut();
  }

  function handleBool(toggleFunction) {
    toggleFunction();
    onClickOut();
  }

  return (
    <div className={css.container} onClick={handleClickOut}>
      <div
        style={{
          left: left + offset.x,
          top: top + offset.y,
        }}
        className={css.contextMenu}
        ref={containerRef}
      >
        {actions.map((actionGroup, i, arr) => {
          const types = {
            actions: () =>
              Object.keys(actionGroup.actions).map((action, a, arr) => (
                <div
                  key={a}
                  className={css.contextMenuItem}
                  onClick={handleAction.bind(null, actionGroup.actions[action])}
                >
                  <div>{action}</div>
                  <div style={{ marginLeft: 16, color: "#666" }}>Ctrl+Z</div>
                </div>
              )),

            enum: () =>
              actionGroup.options.map((action, a, arr) => (
                <div
                  key={a}
                  className={css.contextMenuItem}
                  onClick={handleSelection.bind(null, actionGroup.onChange, a)}
                >
                  <div className={css.radio}>
                    {actionGroup.selected === a ? "⚫" : "⚪"}
                  </div>
                  <span>{action}</span>
                </div>
              )),

            bools: () =>
              Object.keys(actionGroup.options).map((option, a, arr) => (
                <div
                  key={a}
                  className={css.contextMenuItem}
                  onClick={handleAction.bind(
                    null,
                    actionGroup.options[option].function
                  )}
                >
                  <div className={css.checkbox}>
                    {actionGroup.options[option].value === true ? "✔" : " "}
                  </div>
                  <span>{option}</span>
                </div>
              )),
          };

          return (
            <React.Fragment key={i}>
              {types[actionGroup.type]()}
              {i !== arr.length - 1 ? (
                <div className={css.contextMenuDivider} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ContextMenu;
