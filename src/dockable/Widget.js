const createWidget = (WrappedComponent, widgetDef) => {
  class Widget extends WrappedComponent {
    render() {
      return super.render();
    }
  }

  Widget.displayName = widgetDef.id;
  Widget.defaultProps = {
    ...WrappedComponent.defaultProps,
    ...{
      title: widgetDef && widgetDef.title ? widgetDef.title : widgetDef.id,
      minHeight: widgetDef && widgetDef.minHeight ? widgetDef.minHeight : 100,
    },
  };

  return Widget;
};

// Not sure if I need a HOC anymore, so this is a wrapper component for widgets
export function Widget({ id, title = id, actions, minHeight = 100, children }) {
  return children;
}

export default createWidget;
