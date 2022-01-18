import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import css from "./css/Window.module.css";
// import Color from "color";

class Window extends Component {
  widgetRef = React.createRef();
  containerRef = React.createRef();

  defaultActions = [
    {
      type: "actions",
      actions: {
        "Close Tab": () => {
          // console.log
          this.props.onTabClosed(this.props.windowId, this.props.windowId);
        },
        "Close Tab Group": () => {
          this.props.onWindowClosed(this.props.windowId);
        },
      },
    },
  ];

  static defaultProps = {
    padding: 8,
  };

  componentDidUpdate() {
    this.props.onTabSwitch(this.getSize(this.props.selected));
  }

  getSize = (tab) => {
    let widget = React.Children.toArray(this.props.children)[
      tab !== undefined ? tab : this.props.selected
    ];
    let size = widget.props.minHeight ? widget.props.minHeight : 0;
    return (
      size + 34 // content size // tab bar
    );
  };

  handleContextClick = (e) => {
    let ref = this.GetSelectedWidget();

    let clientRect = e.target.getBoundingClientRect(); //this.refs.contextMenuButton.getBoundingClientRect();
    console.log(clientRect);

    this.props.onContextClick(
      this.getActions(ref),
      clientRect.left,
      clientRect.top + clientRect.height
    );
  };

  getActions(ref, includeDefault = true) {
    const defaultActions = includeDefault ? this.defaultActions : [];

    return ref.props.actions
      ? ref.props.actions.call(ref, ref).concat(defaultActions)
      : defaultActions;
  }

  renderBorders = () => [
    this.containerRef.current && this.props.draggingTab ? (
      <div
        key={0}
        className={css.dropBorder}
        onMouseOver={this.props.onHoverBorder.bind(this, this.props.index)}
        onMouseOut={this.props.onHoverBorder.bind(this, null)}
        style={{
          width: this.containerRef.current.getBoundingClientRect().width,
          top: this.containerRef.current.getBoundingClientRect().top - 9,
          left: this.containerRef.current.getBoundingClientRect().left,
        }}
      />
    ) : null,
    this.containerRef.current && this.props.draggingTab && this.props.isLast ? (
      <div
        key={1}
        className={css.dropBorder}
        onMouseOver={this.props.onHoverBorder.bind(this, this.props.index + 1)}
        onMouseOut={this.props.onHoverBorder.bind(this, null)}
        style={{
          width: this.containerRef.current.getBoundingClientRect().width,
          top:
            this.containerRef.current.getBoundingClientRect().top +
            this.containerRef.current.getBoundingClientRect().height -
            9,
          left: this.containerRef.current.getBoundingClientRect().left,
        }}
      />
    ) : null,
  ];

  GetSelectedWidget() {
    return React.Children.toArray(this.props.children)[this.props.selected];
  }

  render() {
    let selected = Math.min(
      Math.max(this.props.selected, 0),
      this.props.children.length - 1
    );

    const selectedWidget = this.GetSelectedWidget();

    return (
      <div
        className={css.container}
        ref={this.containerRef}
        onMouseDown={() =>
          this.props.onActive(
            React.Children.toArray(this.props.children)[this.props.selected]
              .props.id
          )
        }
      >
        <div className={css.window} style={this.props.style}>
          {!this.props.hideTabs && (
            <TabBar
              active={this.props.active}
              widgets={this.props.children}
              selected={this.props.selected}
              onTabClick={(tabId, componentId) => {
                this.props.onTabSelect(tabId, componentId);
              }}
              onContextClick={this.handleContextClick}
              onSort={this.props.onSort}
              windowId={this.props.windowId}
              hoverBorder={this.props.hoverBorder}
              onClose={this.props.onTabClosed.bind(this, this.props.windowId)}
              hideMenu={
                // hide the context menu if there aren't any actions to show
                this.props.hideMenu || !this.getActions(selectedWidget).length
              }
              tabHeight={this.props.tabHeight}
            />
          )}

          <div className={css.content}>{selectedWidget}</div>
        </div>
        {this.renderBorders()}
      </div>
    );
  }
}

class TabBar extends Component {
  render() {
    let { widgets, selected, onTabClick, onContextClick, active } = this.props;

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
      <Droppable droppableId={this.props.windowId} direction="horizontal">
        {(provided, snapshot) => (
          <div
            className={`${css.tabBar} ${
              snapshot.isDraggingOver &&
              !snapshot.draggingFromThisWith &&
              !this.props.hoverBorder
                ? css.tabBarHover
                : ""
            }`}
            style={this.props.tabHeight ? { height: this.props.tabHeight } : {}}
          >
            {/* <div className={css.tabSpacer}> */}
            <div
              ref={provided.innerRef}
              className={css.tabSpacer}
              {...provided.droppableProps}
            >
              {widgets.map((child, i) => (
                <Draggable
                  key={`${this.props.windowId},${i}`}
                  draggableId={`${this.props.windowId},${i}`}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      key={i}
                      className={`${css.tab} ${
                        i === selected ? css.active : ""
                      }`}
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

                      {/* {!this.props.hideMenu && (
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
                            this.props.onClose(i);
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
            {!this.props.hideMenu && (
              <div className={css.burgerMenuContainer} onClick={onContextClick}>
                <div className={css.burgerMenu} />
              </div>
            )}
          </div>
        )}
      </Droppable>
    );
  }
}

export default Window;
