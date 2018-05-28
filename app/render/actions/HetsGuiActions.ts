import { Action } from "redux";
import * as dagreD3 from "dagre-d3";

import { GraphRenderer } from "../reducers/reducer";

export interface HetsGuiActions extends Action {
  graph?: dagreD3.graphlib.Graph;
  node?: dagreD3.Node;
  renderer?: GraphRenderer;
  size?: { width: number; height: number };
}

export const SET_GRAPH = "SET_GRAPH";
export function changeGraphAction(
  graph: dagreD3.graphlib.Graph
): HetsGuiActions {
  return { type: SET_GRAPH, graph: graph };
}

export const SELECT_NODE = "SELECT_NODE";
export function selectNodeAction(node: dagreD3.Node): HetsGuiActions {
  return { type: SELECT_NODE, node: node };
}

export const SET_RENDERER = "SET_RENDERER";
export function changeRendererAction(renderer: GraphRenderer): HetsGuiActions {
  return { type: SET_RENDERER, renderer: renderer };
}

export const SET_SIZE = "SET_SIZE";
export function setSizeAction(size: {
  width: number;
  height: number;
}): HetsGuiActions {
  return { type: SET_SIZE, size: size };
}

export const HIDE_INTERNAL = "HIDE_INTERNAL";
export function hideInternalAction() {
  return { type: HIDE_INTERNAL };
}
