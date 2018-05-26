import * as React from "react";
import { Component } from "react";
import * as d3 from "d3";
import * as dagreD3 from "dagre-d3";

import { IPCComm } from "../actions/IPCComm";
import { QUERY_CHANNEL_RESPONSE } from "../../shared/SharedConstants";
import { DGraphParser } from "../actions/DGraphParser";
import { DGLink, DGNode } from "../../shared/DGraph";
import { removeInternalEdges } from "../actions/GraphHelper";

type DagGraphState = {
  graph?: dagreD3.graphlib.Graph;
  edges: DGLink[];
  nodes: DGNode[];
};

type DagGraphProps = {
  width: number;
  height: number;
};

export class DagGraph extends Component<DagGraphProps, DagGraphState> {
  baseSvg: SVGSVGElement;

  constructor(props: DagGraphProps) {
    super(props);

    IPCComm.recieveMessage(
      QUERY_CHANNEL_RESPONSE,
      this.queryResponse.bind(this)
    );

    this.state = {
      nodes: [],
      edges: []
    };

    this.displayGraph = this.displayGraph.bind(this);
  }

  componentDidMount() {
    this.displayGraph();
  }

  componentDidUpdate() {
    this.displayGraph();
  }

  private queryResponse(_e: any, s: any) {
    const g = new DGraphParser(s);

    this.setState({ edges: g.dgraph.DGLinks, nodes: g.dgraph.DGNodes });
  }

  private displayGraph() {
    const graph = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => {
        return {};
      });
    const svg = d3.select(this.baseSvg);
    svg.selectAll("g").remove();
    const g = svg.append("g") as any;

    const zoom = d3.zoom().on("zoom", () => {
      g.attr("transform", d3.event.transform);
    });
    svg.call(zoom);

    this.state.nodes.forEach(n => {
      graph.setNode(n.id.toString(), { label: n.name });
    });

    this.state.edges.forEach(e => {
      graph.setEdge(e.id_source.toString(), e.id_target.toString(), {
        label: e.name ? e.name : e.Type,
        style: e.Type.includes("Unproven")
          ? "stroke: #f66; fill: none;"
          : e.Type.includes("Proven")
            ? "stroke: #b8db95; fill: none;"
            : "",
        arrowheadStyle: e.Type.includes("Unproven")
          ? "stroke: #f66; fill: #f66;"
          : e.Type.includes("Proven")
            ? "stroke: #b8db95; fill: #b8db95;"
            : ""
      });
    });

    const cleanGraph = removeInternalEdges(this.state.edges, this.state.nodes);

    const render = new dagreD3.render();
    render(g, cleanGraph);

    const initialScale = 0.75;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(
          (Number(svg.attr("width")) -
            cleanGraph.graph().width * initialScale) /
            2,
          20
        )
        .scale(initialScale)
    );
  }

  render() {
    return (
      <>
        <svg
          ref={svg => (this.baseSvg = svg)}
          width={this.props.width}
          height={this.props.height}
        />
      </>
    );
  }
}
