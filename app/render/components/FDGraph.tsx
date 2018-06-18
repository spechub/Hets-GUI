import * as React from "react";
import * as d3 from "d3";
import * as dagreD3 from "dagre-d3";

import { Edge, Node, GraphEdge } from "dagre-d3";

import { NodeLabel, EdgeLabel } from "../actions/GraphHelper";

export interface FDGraphProps {
  width: number;
  height: number;
  graph: dagreD3.graphlib.Graph;
  onSelectNode: (node: Node) => void;
  onSelectEdge: (edge: GraphEdge) => void;
}

interface InternalNode {
  id: number;
  name: string;
  internal: boolean;
  style: string;
  bBox?: { width: number; height: number };
}

interface InternalLink {
  id: number;
  source: number;
  target: number;
  unproven?: boolean;
  proven?: boolean;
  internal?: boolean;
  loops: boolean;
  style: string;
  arrowHeadStyle: string;
  between: { v: string; w: string };
}

export class FDGraph extends React.Component<FDGraphProps> {
  svg: d3.Selection<HTMLElement, any, HTMLElement, any>;
  simulation: d3.Simulation<any, any>;
  base: d3.Selection<Element, any, HTMLElement, any>;

  link: any;
  path: any;
  node: any;

  internalEdges: boolean;
  internalNodes: boolean;

  zoom: d3.ZoomBehavior<any, any>;
  currentZoomTransform: any;

  constructor(props: FDGraphProps) {
    super(props);

    this.internalEdges = true;
    this.internalNodes = true;
  }

  componentDidMount() {
    this.prepareRender();
    this.prepareData();
  }

  componentDidUpdate() {
    this.prepareData();
  }

  render() {
    return (
      <>
        <svg width={this.props.width} height={this.props.height} />
      </>
    );
  }

  private prepareRender() {
    this.svg = d3.select("svg");
    this.base = this.svg.append("g");
    const width = +this.svg.attr("width");
    const height = +this.svg.attr("height");

    this.simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => {
            return d.id;
          })
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2));

    this.zoom = d3
      .zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", () => {
        this.currentZoomTransform = d3.event.transform;
        this.base.attr("transform", this.currentZoomTransform);
      });

    this.svg.call(this.zoom);
  }

  private prepareData() {
    if (!this.props.graph) {
      return;
    }

    const links: InternalLink[] = [];
    const nodes: InternalNode[] = [];

    this.props.graph.nodes().forEach((gNode: string) => {
      const nLabels: NodeLabel = this.props.graph.node(gNode);

      nodes.push({
        id: +gNode,
        name: nLabels.label,
        internal: nLabels.internal,
        style: nLabels.style
      });
    });

    this.props.graph.edges().forEach((gEdge: Edge, i: number) => {
      const eLabels: EdgeLabel = this.props.graph.edge(gEdge);
      links.push({
        id: i,
        source: +gEdge.v,
        target: +gEdge.w,
        loops: false,
        style: eLabels.style,
        arrowHeadStyle: eLabels.arrowheadStyle,
        between: { v: gEdge.v, w: gEdge.w }
      });
    });

    for (const link of links) {
      for (const other of links) {
        if (
          link === other ||
          other.source !== link.target ||
          other.target !== link.source
        ) {
          continue;
        }
        other.loops = true;
      }
    }

    this.updateGraphRender(links, nodes);
  }

  private updateGraphRender(links: InternalLink[], nodes: InternalNode[]) {
    this.base.remove();
    this.base = this.svg.append("g");
    this.base.attr("transform", this.currentZoomTransform);

    this.link = this.base
      .append("g")
      .attr("class", "links")
      .selectAll(".line")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "line");

    this.path = this.link
      .append("path")
      .attr("style", (l: InternalLink) => {
        return l.style;
      })
      .attr("marker-end", (_: InternalLink, i: number) => {
        return `url(#arrowhead${i})`;
      });

    this.link
      .append("defs")
      .append("marker")
      .attr("id", (_: InternalLink, i: number) => {
        return "arrowhead" + i;
      })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("style", (l: InternalLink) => {
        return l.arrowHeadStyle;
      });

    this.node = this.base
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag<any, InternalNode>()
          .on("start", this.dragstarted.bind(this))
          .on("drag", this.dragged.bind(this))
          .on("end", this.dragended.bind(this))
      );

    this.node.append("title").text((d: any) => {
      return d.name;
    });

    this.node
      .filter((d: InternalNode) => {
        return !d.internal;
      })
      .append("text")
      .append("tspan")
      .attr("x", 0)
      .attr("y", 4.5)
      .classed("center-text", true)
      .text((n: InternalNode) => {
        return n.name;
      });

    d3.selectAll(".nodes text").each(
      (d: InternalNode, i: number, nodes: any[]) => {
        d.bBox = nodes[i].getBBox();
      }
    );

    this.node
      .append("ellipse")
      .lower()
      .attr("rx", (d: InternalNode) => {
        return d.bBox ? d.bBox.width / 2 + 6 : 10;
      })
      .attr("ry", (d: InternalNode) => {
        return d.bBox ? d.bBox.height : 5;
      })
      .attr("class", (n: InternalNode) => {
        return n.internal ? "internal" : "fd-node";
      })
      .attr("style", (n: InternalNode) => {
        return (n.style += n.internal
          ? `fill: ${this.getStrokeColor(n.style)}`
          : "");
      });

    this.base.selectAll("g.node").on("click", (n: InternalNode) => {
      this.props.onSelectNode(this.props.graph.node(n.id.toString()));
      d3.event.stopPropagation();
    });

    this.base.selectAll("g.line").on("click", (l: InternalLink) => {
      this.props.onSelectEdge(this.props.graph.edge(l.between.v, l.between.w));
      d3.event.stopPropagation();
    });

    this.svg.on("click", () => {
      this.props.onSelectEdge(null);
      this.props.onSelectNode(null);
      d3.event.stopPropagation();
    });

    this.simulation.alpha(1).restart();
    this.simulation.nodes(nodes).on("tick", this.ticked.bind(this));
    (this.simulation.force("link") as any).links(links);
  }

  private ticked() {
    this.path.attr("d", this.positionLink.bind(this));

    this.node.attr("transform", (n: any) => {
      return `translate(${n.x} ${n.y})`;
    });
  }

  private positionLink(l: any) {
    if (l.loops) {
      return `M ${l.source.x} ${l.source.y} Q ${this.offsetLoop(l).x} ${
        this.offsetLoop(l).y
      }, ${this.shortenEndLoop(l).x} ${this.shortenEndLoop(l).y}`;
    } else {
      return `M ${l.source.x} ${l.source.y} L ${this.shortenEnd(l).x} ${
        this.shortenEnd(l).y
      }`;
    }
  }

  private shortenEnd(d: any) {
    const vec = { x: d.target.x - d.source.x, y: d.target.y - d.source.y };
    const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return {
      x: d.target.x - (vec.x / len) * 8,
      y: d.target.y - (vec.y / len) * 8
    };
  }

  private offsetLoop(d: any): { x: number; y: number } {
    const vec = { x: d.target.x - d.source.x, y: d.target.y - d.source.y };
    const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return {
      x: d.source.x + (-vec.y / len) * 20 + vec.x * 0.5,
      y: d.source.y + (vec.x / len) * 20 + vec.y * 0.5
    };
  }

  private shortenEndLoop(d: any) {
    const vec = { x: d.target.x - d.source.x, y: d.target.y - d.source.y };
    const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return {
      x: d.target.x + (-vec.y / len) * 7 - vec.x * 0.1,
      y: d.target.y + (vec.x / len) * 7 - vec.y * 0.1
    };
  }

  private dragstarted(d: any) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(d: any) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private dragended(d: any) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  private getStrokeColor(s: string): string {
    const re = /stroke:\s(#\w{6});/g;
    const res = re.exec(s);
    return res.length > 1 ? res[1] : "";
  }
}
