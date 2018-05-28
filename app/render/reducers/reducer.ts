import * as dagreD3 from "dagre-d3";

import {
  HetsGuiActions,
  SELECT_NODE,
  SET_GRAPH,
  SET_RENDERER,
  SET_SIZE,
  HIDE_INTERNAL
} from "../actions/HetsGuiActions";
import { removeInternalEdges } from "../actions/GraphHelper";

export enum GraphRenderer {
  FORCE_DIRCETED,
  GRAPHVIZ
}

export type HetsGuiState = {
  graph: dagreD3.graphlib.Graph;
  selectedNode: dagreD3.Node;
  openRenderer: GraphRenderer;
  svgSize: { width: number; height: number };
};

const initialState: HetsGuiState = {
  graph: null,
  selectedNode: null,
  openRenderer: GraphRenderer.GRAPHVIZ,
  svgSize: { width: 0, height: 0 }
};

export function hetsGui(
  state: HetsGuiState = initialState,
  action: HetsGuiActions
): HetsGuiState {
  switch (action.type) {
    case SELECT_NODE:
      return Object.assign({}, state, {
        selectedNode: action.node
      });
    case SET_GRAPH:
      return Object.assign({}, state, {
        graph: action.graph
      });
    case SET_RENDERER:
      return Object.assign({}, state, {
        openRenderer: action.renderer
      });
    case SET_SIZE:
      return Object.assign({}, state, {
        openRenderer: action.size
      });
    case HIDE_INTERNAL:
      return Object.assign({}, state, {
        graph: removeInternalEdges(state.graph)
      });
    default:
      return state;
  }
}
