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
      minHeight: widgetDef && widgetDef.minHeight ? widgetDef.minHeight : 100
    }
  };

  return Widget;
};

export default createWidget;
