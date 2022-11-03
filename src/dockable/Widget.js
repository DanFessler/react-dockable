// Not sure if I need a HOC anymore, so this is a wrapper component for widgets
export function Widget({ id, title = id, actions, minHeight = 100, children }) {
  return children;
}
