import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";
import { DGNode, DGLink } from "../../shared/DGraph";

const edgeStyle = (e: DGLink) => {
  return e.Type.includes("Unproven")
    ? "stroke: #e5647a; fill: none;"
    : e.Type.includes("Proven")
      ? "stroke: #b8db95; fill: none;"
      : e.Type.includes("Hiding")
        ? "stroke: #6babef; fill: none;"
        : "stroke: #999; fill: none;";
};

const arrowheadStyle = (e: DGLink) => {
  return e.Type.includes("Unproven")
    ? "stroke: #e5647a; fill: #e5647a;"
    : e.Type.includes("Proven")
      ? "stroke: #b8db95; fill: #b8db95;"
      : e.Type.includes("Hiding")
        ? "stroke: #6babef; fill: #6babef;"
        : "stroke: #999; fill: #999;";
};

const nodeStyle = (n: DGNode) => {
  return {
    style:
      n.Theorems.length > 0
        ? "fill: white; stroke: #e5647a; stroke-width: 3.5px;"
        : "fill: white; stroke: #b8db95; stroke-width: 3.5px;",
    shape: n.reference ? "rect" : "ellipse"
  };
};

// TODO: optimize
// maybe pre filter *proven edges
export function removeInternalEdges(
  nodes: DGNode[],
  edges: DGLink[]
): dagreD3.graphlib.Graph {
  const graph = constructGraph(nodes, edges);

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
            graph.setEdge(eIn.v, eOut.w, {
              curve: d3.curveBasis,
              style: "stroke: #999; fill: none;",
              arrowheadStyle: "stroke: #999; fill: #999;"
            }); // neue Kante von source eingehender zu target ausgehender
          }
        });
      });
    }
    graph.removeNode(n);
  }

  return graph;
}

export function constructGraph(
  nodes: DGNode[],
  edges: DGLink[]
): dagreD3.graphlib.Graph {
  const graph = new dagreD3.graphlib.Graph()
    .setGraph({
      // ranker: "longest-path"
    })
    .setDefaultEdgeLabel(() => {
      return {};
    });

  nodes.forEach(n => {
    graph.setNode(n.id.toString(), {
      label: n.name,
      axioms: n.Axioms,
      declarations: n.Declarations,
      theorems: n.Theorems,
      logic: n.logic,
      internal: n.internal,
      reference: n.reference,
      Reference: n.Reference,
      ...nodeStyle(n)
    });
  });

  edges.forEach(e => {
    graph.setEdge(e.id_source.toString(), e.id_target.toString(), {
      label: e.name ? e.name : "",
      curve: d3.curveBasis,
      style: edgeStyle(e),
      arrowheadStyle: arrowheadStyle(e),
      ConsStatus: e.ConsStatus,
      Rule: e.Rule,
      Type: e.Type
    });
  });

  return graph;
}
