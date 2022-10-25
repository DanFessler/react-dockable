import React, { useEffect, useRef } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import css from "./css/Window.module.css";
// import Color from "color";

function Window({
  index,
  active,
  windowId,
  isLast,
  draggingTab,
  hoverBorder,
  selected,
  hideTabs,
  hideMenu,
  tabHeight,
  style,
  onSort,
  onActive,
  onContextClick,
  onHoverBorder,
  onTabSelect,
  onTabSwitch,
  onTabClosed,
  onWindowClosed,
  children,
}) {
  const widgetRef = useRef();
  const containerRef = useRef();

  // When tab has been switched, report the minsize of the new widget
  useEffect(() => {
    function getSize(tab) {
      let widget =
        React.Children.toArray(children)[tab == undefined ? selected : tab];
      let size = widget.props.minHeight ? widget.props.minHeight : 0;
      return size + 34; // content size + tab bar
    }
    onTabSwitch(getSize(selected));
  }, [selected, children]);

  function handleContextClick(e) {
    let ref = GetSelectedWidget();
    let clientRect = e.target.getBoundingClientRect();

    onContextClick(
      getActions(ref),
      clientRect.left,
      clientRect.top + clientRect.height
    );
  }

  function getActions(ref, includeDefault = true) {
    const actions = [];

    if (includeDefault)
      actions.push({
        type: "actions",
        actions: {
          "Close Tab": () => {
            onTabClosed(windowId, selected);
          },
          "Close Tab Group": () => {
            onWindowClosed(windowId);
          },
        },
      });

    return ref.props.actions
      ? ref.props.actions.call(ref, ref).concat(actions)
      : actions;
  }

  function renderBorders() {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    return [
      draggingTab && (
        <div
          key={0}
          className={css.dropBorder}
          onMouseOver={() => onHoverBorder(index)}
          onMouseOut={() => onHoverBorder(null)}
          style={{
            width: rect.width,
            top: rect.top - 9,
            left: rect.left,
          }}
        />
      ),
      draggingTab && isLast && (
        <div
          key={1}
          className={css.dropBorder}
          onMouseOver={() => onHoverBorder(index + 1)}
          onMouseOut={() => onHoverBorder(null)}
          style={{
            width: rect.width,
            top: rect.top + rect.height - 9,
            left: rect.left,
          }}
        />
      ),
    ];
  }

  function GetSelectedWidget() {
    return React.Children.toArray(children)[selected];
  }

  return (
    <div
      className={css.container}
      ref={containerRef}
      onMouseDown={() =>
        onActive(React.Children.toArray(children)[selected].props.id)
      }
    >
      <div className={css.window} style={style}>
        {!hideTabs && (
          <TabBar
            active={active}
            widgets={children}
            selected={selected}
            onTabClick={(tabId, componentId) => {
              onTabSelect(tabId, componentId);
            }}
            onContextClick={handleContextClick}
            onSort={onSort}
            windowId={windowId}
            hoverBorder={hoverBorder}
            onClose={() => onTabClosed(windowId)}
            hideMenu={
              // hide the context menu if there aren't any actions to show
              hideMenu || !getActions(GetSelectedWidget()).length
            }
            tabHeight={tabHeight}
          />
        )}

        <div className={css.content}>{GetSelectedWidget()}</div>
      </div>
      {renderBorders()}
    </div>
  );
}

function TabBar({
  active,
  widgets,
  selected,
  onTabClick,
  onContextClick,
  onSort,
  windowId,
  hoverBorder,
  onClose,
  hideMenu,
  tabHeight,
}) {
  function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    const { curve, duration } = snapshot.dropAnimation;
    return {
      ...style,
      // cannot be 0, but make it super tiny
      transition: `all ${curve} ${
        snapshot.isDropAnimating ? 0.001 : duration
      }s`,
      // boxShadow: snapshot.isDragging
      //   ? "0 1px 10px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.25)"
      //   : `1px -1px 0 #353535, -1px -1px 0 #353535`,
      borderRadius: snapshot.isDragging ? 1 : 0,
    };
  }

  return (
    <Droppable droppableId={windowId} direction="horizontal">
      {(provided, snapshot) => (
        <div
          className={`${css.tabBar} ${
            snapshot.isDraggingOver &&
            !snapshot.draggingFromThisWith &&
            !hoverBorder
              ? css.tabBarHover
              : ""
          }`}
          style={tabHeight ? { height: tabHeight } : {}}
        >
          {/* <div className={css.tabSpacer}> */}
          <div
            ref={provided.innerRef}
            className={css.tabSpacer}
            {...provided.droppableProps}
          >
            {widgets.map((child, i) => (
              <Draggable
                key={`${windowId},${i}`}
                draggableId={`${windowId},${i}`}
                index={i}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={i}
                    className={`${css.tab} ${i === selected ? css.active : ""}`}
                    onMouseDown={(e) => {
                      onTabClick(i, child.props.id);
                      e.stopPropagation();
                    }}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                  >
                    <span
                      className={css.title}
                      style={{
                        fontWeight:
                          i === selected && child.props.id === active
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {child.props.title || child.props.id}
                    </span>

                    {/* {!hideMenu && (
                        <div
                          className={css.burgerMenuContainer}
                          onClick={onContextClick}
                          style={
                            {
                              width: i === selected && !snapshot.isDragging ? 32 : 0
                            }
                          }
                        >
                          <div className={css.burgerMenu} />
                        </div>
                      )} */}

                    {child.props.closeable ? (
                      <div
                        className={css.closeBox}
                        onClick={(e) => {
                          if (child.props.onClose)
                            child.props.onClose(child.props.id);
                          onClose(i);
                        }}
                      />
                    ) : null}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          {/* </div> */}
          {/* <div className={css.tabSpacer} /> */}
          {!hideMenu && (
            <div className={css.burgerMenuContainer} onClick={onContextClick}>
              <div className={css.burgerMenu} />
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
}

export default Window;
