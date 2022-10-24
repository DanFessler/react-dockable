import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { arrayMoveImmutable as arrayMove } from "array-move";
import PanelGroup from "../react-panelgroup";
import ContextMenu from "./ContextMenu";
import WindowPanel from "./WindowPanel";

import css from "./css/Dockable.module.css";

// TODO declarative API
// <Dockable>
//   <Panel>
//     <Window>
//       <Tab title="Widget A" component={MyWidgetA} />
//       <Tab title="Widget B" component={MyWidgetB} />
//       <Tab title="Widget C" component={MyWidgetC} />
//     </Window>
//   </Panel>
// </Dockable>

function Dockable({
  initialState,
  hidden,
  onUpdate,
  onActive,
  themeClass,
  theme,
  spacing = 1,
  hideMenus,
  hideTabs,
  active,
  tabHeight,
  children,
}) {
  const [state, setState] = useState({
    contextMenu: null,
    panels: [],
    draggingTab: false,
    hoverBorder: null,
  });

  // load internal panels state from initial props
  // OR build state based on supplied child widgets
  useEffect(() => {
    if (initialState) {
      setState((state) => ({
        ...state,
        panels: initialState,
      }));
    } else {
      updatePanels([
        {
          size: 277,
          minSize: 277,
          resize: "stretch",
          windows: [
            {
              selected: 0,
              widgets: React.Children.map(children, (widget) => ({
                component: widget.type.displayName,
              })),
            },
          ],
        },
      ]);
    }
  }, [initialState]);

  // TODO this line seems wrong. it shouldn't get initial state but current state right?
  // I dont trust myself enough to change it right now
  function getPanels() {
    return initialState;
  }

  // Get only the panels which haven't been specified as hidden
  // via the props.hidden array
  function getFilteredPanels() {
    if (!hidden) return getPanels();

    return initialState.filter((panel) => {
      return (
        panel.windows.filter((window) => {
          return (
            window.widgets.filter((widget) => {
              return !this.props.hidden[widget];
            }).length > 0
          );
        }).length > 0
      );
    });
  }

  function handleContextClick(actions, x, y) {
    setState({
      ...state,
      contextMenu: {
        show: true,
        position: { x: x, y: y },
        actions: actions,
      },
    });
  }

  function updatePanels(newPanels) {
    setState({ ...state, panels: newPanels });
    onUpdate && onUpdate(newPanels);
  }

  function handlePanelResize(panels) {
    updatePanels(
      getPanels().map((oldPanel, i) => ({
        ...oldPanel,
        ...panels[i],
      }))
    );
  }

  function handleWindowResize(panelId, windows) {
    let newWindows = getPanels()[panelId].windows.map((oldWindow, i) => ({
      ...oldWindow,
      ...windows[i],
    }));
    let newPanels = [...getPanels()];
    newPanels[panelId].windows = newWindows;
    updatePanels(newPanels);
  }

  function handleTabSort(panelIndex, windowIndex, tabStart, tabEnd) {
    let newPanels = [...getPanels()];
    newPanels[panelIndex].windows[windowIndex].widgets = arrayMove(
      newPanels[panelIndex].windows[windowIndex].widgets,
      tabStart,
      tabEnd
    );
    updatePanels(newPanels);
  }

  function handleTabSelect(panelId, windowId, tabId, componentId) {
    let newPanels = [...getPanels()];
    newPanels[panelId].windows[windowId].selected = tabId;
    updatePanels(newPanels);
    handleOnActive(componentId);
  }

  function handleOnActive(id) {
    if (onActive) onActive(id);
  }

  function handleTabClosed(panelId, windowId, tabId) {
    let newPanels = JSON.parse(JSON.stringify(getPanels()));
    newPanels[panelId].windows[windowId].widgets.splice(tabId, 1);
    newPanels = cleanup(newPanels);
    updatePanels(newPanels);

    // TODO: for some reason I commented out code for an onclose callback, should revisit
    // this was also when this was still a class function
    // let callback = React.Children.toArray(this.props.children).find(widget => {
    //   return (
    //     widget.props.id ===
    //     this.getPanels()[panelId].windows[windowId].widgets[tabId]
    //   );
    // }).props.onClose;
    // if (callback) callback();
  }

  function handleWindowClosed(panelId, windowId) {
    let newPanels = JSON.parse(JSON.stringify(getPanels()));

    newPanels[panelId].windows[windowId].widgets = [];
    newPanels = cleanup(newPanels);

    updatePanels(newPanels);
  }

  function handleDragStart() {
    setState({ ...state, draggingTab: true });
  }

  function handleDragEnd(result) {
    let newPanels = JSON.parse(JSON.stringify(getPanels()));
    let source = result.source.droppableId.split(",");

    // If we dropped on a tab bar
    if (result.destination && state.hoverBorder == null) {
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
    else if (state.hoverBorder !== null) {
      // remove from source
      let item = newPanels[source[0]].windows[source[1]].widgets.splice(
        result.source.index,
        1
      );

      // Add to destination

      // If we dropped between windows
      if (state.hoverBorder[1] !== null) {
        newPanels[state.hoverBorder[0]].windows.splice(
          state.hoverBorder[1],
          0,
          {
            selected: 0,
            widgets: item,
          }
        );
      }
      // If we dropped between panels
      else {
        newPanels.splice(state.hoverBorder[0], 0, {
          ...newPanels[source[0]],
          windows: [
            {
              selected: 0,
              widgets: item,
            },
          ],
        });
      }
    }

    newPanels = cleanup(newPanels);

    updatePanels(newPanels);
    setState({ ...state, draggingTab: false, hoverBorder: null });
  }

  function cleanup(panels) {
    // Cleanup unused empty windows
    panels = panels.map((panel) => {
      return {
        ...panel,
        windows: panel.windows.filter((win) => win.widgets.length > 0),
      };
    });

    // Cleanup empty panels
    panels = panels.filter((panel) => panel.windows.length > 0);

    return panels;
  }

  return (
    <div
      className={`Dockable_root ${css.container} ${
        themeClass ? themeClass : css.theme
      }`}
      style={theme}
    >
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <PanelGroup
          spacing={spacing || 0}
          borderColor={"transparent"}
          panelWidths={getFilteredPanels()}
          // onResizeEnd={handlePanelResize}
          onUpdate={handlePanelResize}
        >
          {getFilteredPanels().map((thisPanel, panelIndex) => (
            <WindowPanel
              key={panelIndex}
              index={panelIndex}
              isLast={panelIndex === getPanels().length - 1}
              draggingTab={state.draggingTab}
              hoverBorder={state.hoverBorder}
              onHoverBorder={(i) => setState({ ...state, hoverBorder: i })}
              windows={thisPanel.windows}
              onTabSort={handleTabSort}
              onTabSelect={handleTabSelect}
              onContextClick={handleContextClick}
              widgets={children}
              onUpdate={handleWindowResize}
              onTabClosed={handleTabClosed}
              onWindowClosed={handleWindowClosed}
              spacing={spacing || 0}
              hideMenus={hideMenus}
              hideTabs={hideTabs}
              active={active}
              onActive={handleOnActive}
              tabHeight={tabHeight}
              hidden={hidden || {}}
            />
          ))}
        </PanelGroup>
      </DragDropContext>
      {state.contextMenu && state.contextMenu.show && (
        <ContextMenu
          left={state.contextMenu.position.x}
          top={state.contextMenu.position.y}
          actions={state.contextMenu.actions}
          onClickOut={() =>
            setState({
              ...state,
              contextMenu: { ...state.contextMenu, show: false },
            })
          }
        />
      )}
    </div>
  );
}

export default Dockable;
