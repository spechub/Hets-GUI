import * as React from "react";
import { Component } from "react";
import * as d3 from "d3";
import * as dagreD3 from "dagre-d3";

import { IPCComm } from "../actions/IPCComm";
import { QUERY_CHANNEL_RESPONSE } from "../../shared/SharedConstants";
import { DGraphParser } from "../actions/DGraphParser";
import { DGLink, DGNode } from "../../shared/DGraph";

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
  graph: dagreD3.graphlib.Graph;
  nodes: { id: string; name?: string; internal?: boolean }[];

  constructor(props: DagGraphProps) {
    super(props);

    IPCComm.recieveMessage(
      QUERY_CHANNEL_RESPONSE,
      this.queryResponse.bind(this)
    );

    this.graph = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => {
        return {};
      });

    this.state = {
      nodes: [],
      edges: []
    };

    this.nodes = [];

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
    const svg = d3.select(this.baseSvg);
    svg.selectAll("g").remove();
    const g = svg.append("g") as any;

    const zoom = d3.zoom().on("zoom", () => {
      g.attr("transform", d3.event.transform);
    });
    svg.call(zoom);

    this.state.nodes.forEach(n => {
      this.graph.setNode(n.id.toString(), { label: n.name });
    });

    this.state.edges.forEach(e => {
      this.graph.setEdge(e.id_source.toString(), e.id_target.toString());
    });

    const render = new dagreD3.render();
    render(g, this.graph);

    const initialScale = 0.75;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(
          (Number(svg.attr("width")) -
            this.graph.graph().width * initialScale) /
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
