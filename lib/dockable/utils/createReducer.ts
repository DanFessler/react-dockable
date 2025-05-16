import { produce } from "immer";

type ActionFunctions<S, A extends { type: string }> = {
  [K in A["type"]]: (state: S, action: Extract<A, { type: K }>) => void;
};

function createReducer<S, A extends { type: string }>(
  handlers: ActionFunctions<S, A>
) {
  return (state: S, action: A): S => {
    const handler = handlers[action.type as keyof typeof handlers];
    if (!handler) {
      return state;
    }
    return produce(state, (draft: S) => {
      return handler(draft, action as Extract<A, { type: A["type"] }>);
    });
  };
}

export default createReducer;
