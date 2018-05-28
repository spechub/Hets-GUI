import * as dagreD3 from "dagre-d3";

// TODO: optimize
// maybe pre filter *proven edges
export function removeInternalEdges(
  graph: dagreD3.graphlib.Graph
): dagreD3.graphlib.Graph {
  for (const n of graph.nodes()) {
    if (!graph.node(n).internal) {
      continue;
    }

    const outEdges = graph.outEdges(n);

    // no in edges
    if (graph.inEdges(n).length <= 0) {
      outEdges.forEach(e => {
        graph.removeEdge(e.v, e.w);
      });
    } else {
      // in edges
      const inEdges = graph.inEdges(n);
      inEdges.forEach(eIn => {
        graph.removeEdge(eIn.v, eIn.w); // alle eingehenden Kanten löschen
        outEdges.forEach(eOut => {
          graph.removeEdge(eOut.v, eOut.w); // alle ausgehenden Kanten löschen
          if (eIn.v !== eOut.w) {
            graph.setEdge(eIn.v, eOut.w); // neue Kante von source eingehender zu target ausgehender
          }
        });
      });
    }
    graph.removeNode(n);
  }

  return graph;
}
