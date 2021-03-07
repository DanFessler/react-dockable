import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import arrayMove from "array-move";
import PanelGroup from "../react-panelgroup";
import ContextMenu from "./ContextMenu";
import WindowPanel from "./WindowPanel";

import css from "./css/Dockable.module.css";

class Dockable extends Component {
  static defaultProps = {
    spacing: 1
  };

  state = {
    contextMenu: {
      show: false,
      position: {
        x: 0,
        y: 0
      },
      actions: [{ poop: function() {} }]
    },
    panels: [],
    draggingTab: false,
    hoverBorder: null
  };

  getPanels() {
    return this.props.initialState;
  }

  getFilteredPanels() {
    if (!this.props.hidden) return this.getPanels();

    return this.props.initialState.filter(panel => {
      return (
        panel.windows.filter(windows => {
          return (
            windows.widgets.filter(widget => {
              return !this.props.hidden[widget];
            }).length > 0
          );
        }).length > 0
      );
    });
  }

  componentDidMount() {
    if (this.props.initialState) {
      this.setState({ panels: this.props.initialState });
    } else {
      let newPanels = [
        {
          size: 277,
          minSize: 277,
          resize: "stretch",
          windows: [
            {
              selected: 0,
              widgets: React.Children.map(this.props.children, widget => ({
                component: widget.type.displayName
              }))
            }
          ]
        }
      ];
      this.updatePanels(newPanels);
    }
  }

  handleContextClick = (actions, x, y) => {
    this.setState({
      contextMenu: {
        show: true,
        position: { x: x, y: y },
        actions: actions
      }
    });
  };

  updatePanels = newPanels => {
    this.setState(({ items }) => ({
      panels: newPanels
    }));
    this.props.onUpdate && this.props.onUpdate(newPanels);
  };

  handlePanelResize = panels => {
    let newPanels = this.getPanels().map((oldPanel, i) => ({
      ...oldPanel,
      ...panels[i]
    }));
    this.updatePanels(newPanels);
  };

  handleWindowResize = (panelId, windows) => {
    let newWindows = this.getPanels()[panelId].windows.map((oldWindow, i) => ({
      ...oldWindow,
      ...windows[i]
    }));
    let newPanels = [...this.getPanels()];
    newPanels[panelId].windows = newWindows;
    this.updatePanels(newPanels);
  };

  handleTabSort = (panelIndex, windowIndex, tabStart, tabEnd) => {
    let newPanels = [...this.getPanels()];
    newPanels[panelIndex].windows[windowIndex].widgets = arrayMove(
      newPanels[panelIndex].windows[windowIndex].widgets,
      tabStart,
      tabEnd
    );
    this.updatePanels(newPanels);
  };

  handleTabSelect = (panelId, windowId, tabId, componentId) => {
    let newPanels = [...this.getPanels()];
    newPanels[panelId].windows[windowId].selected = tabId;
    this.updatePanels(newPanels);
    // this.props.onTabSwitch(this.getSize(panelId, windowId, tabId));
    this.handleOnActive(componentId);
  };

  handleOnActive = id => {
    if (this.props.onActive) {
      this.props.onActive(id);
    }
  };

  handleTabClosed = (panelId, windowId, tabId) => {
    console.log("CLOSING", panelId, windowId, tabId);
    // let callback = React.Children.toArray(this.props.children).find(widget => {
    //   return (
    //     widget.props.id ===
    //     this.getPanels()[panelId].windows[windowId].widgets[tabId]
    //   );
    // }).props.onClose;

    let newPanels = JSON.parse(JSON.stringify(this.getPanels()));
    newPanels[panelId].windows[windowId].widgets.splice(tabId, 1);
    newPanels = this.cleanup(newPanels);
    this.updatePanels(newPanels);

    // if (callback) callback();
  };

  handleDragStart = result => {
    this.setState({ draggingTab: true });
  };

  handleDragEnd = result => {
    let newPanels = JSON.parse(JSON.stringify(this.getPanels()));
    let source = result.source.droppableId.split(",");

    // If we dropped on a tab bar
    if (result.destination && this.state.hoverBorder == null) {
      // remove from source
      let item = newPanels[source[0]].windows[source[1]].widgets.splice(
        result.source.index,
        1
      );

      // Select first tab from source window
      newPanels[source[0]].windows[source[1]].selected = 0;

      // add to destination
      let destination = result.destination.droppableId.split(",");
      newPanels[destination[0]].windows[destination[1]].widgets.splice(
        result.destination.index,
        0,
        item[0]
      );

      // Select new tab at destination window
      newPanels[destination[0]].windows[destination[1]].selected =
        result.destination.index;
    }

    // If we dropped between panels
    else if (this.state.hoverBorder !== null) {
      // remove from source
      let item = newPanels[source[0]].windows[source[1]].widgets.splice(
        result.source.index,
        1
      );

      // Add to destination

      // If we dropped between windows
      if (this.state.hoverBorder[1] !== null) {
        newPanels[this.state.hoverBorder[0]].windows.splice(
          this.state.hoverBorder[1],
          0,
          {
            selected: 0,
            widgets: item
          }
        );
      }
      // If we dropped between panels
      else {
        newPanels.splice(this.state.hoverBorder[0], 0, {
          ...newPanels[source[0]],
          windows: [
            {
              selected: 0,
              widgets: item
            }
          ]
        });
      }
    }

    newPanels = this.cleanup(newPanels);

    this.updatePanels(newPanels);
    this.setState({ draggingTab: false, hoverBorder: null });
  };

  cleanup = panels => {
    // Cleanup unused empty windows
    panels = panels.map(panel => {
      return {
        ...panel,
        windows: panel.windows.filter(win => win.widgets.length > 0)
      };
    });

    // Cleanup empty panels
    panels = panels.filter(panel => panel.windows.length > 0);

    return panels;
  };

  render() {
    return (
      <div
        className={`Dockable_root ${css.container}`}
        style={this.props.theme}
      >
        <DragDropContext
          onDragEnd={this.handleDragEnd}
          onDragStart={this.handleDragStart}
        >
          <PanelGroup
            spacing={this.props.spacing || 0}
            borderColor={"transparent"}
            panelWidths={this.getFilteredPanels()}
            // onResizeEnd={this.handlePanelResize}
            onUpdate={this.handlePanelResize}
          >
            {this.getFilteredPanels().map((thisPanel, panelIndex) => (
              <WindowPanel
                key={panelIndex}
                index={panelIndex}
                isLast={panelIndex === this.getPanels().length - 1}
                draggingTab={this.state.draggingTab}
                hoverBorder={this.state.hoverBorder}
                onHoverBorder={i => this.setState({ hoverBorder: i })}
                windows={thisPanel.windows}
                onTabSort={this.handleTabSort}
                onTabSelect={this.handleTabSelect}
                onContextClick={this.handleContextClick}
                widgets={this.props.children}
                onUpdate={this.handleWindowResize}
                onTabClosed={this.handleTabClosed}
                spacing={this.props.spacing || 0}
                hideMenus={this.props.hideMenus}
                hideTabs={this.props.hideTabs}
                active={this.props.active}
                onActive={this.handleOnActive}
                tabHeight={this.props.tabHeight}
                hidden={this.props.hidden || {}}
              />
            ))}
          </PanelGroup>
        </DragDropContext>
        {this.state.contextMenu.show && (
          <ContextMenu
            left={this.state.contextMenu.position.x}
            top={this.state.contextMenu.position.y}
            actions={this.state.contextMenu.actions}
            onClickOut={() =>
              this.setState({
                contextMenu: { ...this.state.contextMenu, show: false }
              })
            }
          />
        )}
      </div>
    );
  }
}

export default Dockable;
