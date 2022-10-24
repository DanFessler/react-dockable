function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var createWidget = function createWidget(WrappedComponent, widgetDef) {
  var Widget = /*#__PURE__*/function (_WrappedComponent) {
    _inheritsLoose(Widget, _WrappedComponent);

    function Widget() {
      return _WrappedComponent.apply(this, arguments) || this;
    }

    var _proto = Widget.prototype;

    _proto.render = function render() {
      return _WrappedComponent.prototype.render.call(this);
    };

    return Widget;
  }(WrappedComponent);

  Widget.displayName = widgetDef.id;
  Widget.defaultProps = _extends({}, WrappedComponent.defaultProps, {
    title: widgetDef && widgetDef.title ? widgetDef.title : widgetDef.id,
    minHeight: widgetDef && widgetDef.minHeight ? widgetDef.minHeight : 100
  });
  return Widget;
}; // Not sure if I need a HOC anymore, so this is a wrapper component for widgets


export function Widget(_ref) {
  var id = _ref.id,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? id : _ref$title,
      actions = _ref.actions,
      _ref$minHeight = _ref.minHeight,
      minHeight = _ref$minHeight === void 0 ? 100 : _ref$minHeight,
      children = _ref.children;
  return children;
}
export default createWidget;