import * as React from "react";
import * as d3 from "d3";
import { Event } from "electron";

import { GraphControls } from "./GraphControls";
import { DGNode, DGLink } from "../../shared/DGraph";

export interface FDGraphProps {
  width: string;
  height: string;
  nodes: DGNode[];
  edges: DGLink[];
}

interface InternalNode {
  id: number;
  name: string;
  internal: boolean;
}

interface InternalLink {
  id: number;
  source: number;
  target: number;
  unproven: boolean;
  proven: boolean;
  internal: boolean;
  loops: boolean;
}

export class FDGraph extends React.Component<FDGraphProps> {
  svg: d3.Selection<HTMLElement, any, HTMLElement, any>;
  simulation: d3.Simulation<any, any>;
  base: d3.Selection<Element, any, HTMLElement, any>;

  link: any;
  node: any;

  internalEdges: boolean;
  internalNodes: boolean;

  zoom: d3.ZoomBehavior<any, any>;
  currentZoomTransform: any;

  constructor(props: any) {
    super(props);

    this.internalEdges = false;
    this.internalNodes = true;
  }

  componentDidMount() {
    this.renderGraph();
    this.prepareData(this.props.nodes, this.props.edges);
  }

  componentDidUpdate() {
    this.prepareData(this.props.nodes, this.props.edges);
  }

  render() {
    return (
      <>
        <svg width={this.props.width} height={this.props.height} />
        <GraphControls
          edgeStrengthsChanged={this.inputted.bind(this)}
          showInternalEdges={this.showInternalEdges.bind(this)}
          showInternalNodes={this.showInternalNodes.bind(this)}
        />
      </>
    );
  }

  private renderGraph() {
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
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody())
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

  private inputted(_e: Event, d: any) {
    (this.simulation.force("link") as any).strength(+d.value);
    this.simulation.alpha(1).restart();
  }

  private showInternalEdges() {
    this.internalEdges = !this.internalEdges;
    if (this.props.nodes && this.props.edges) {
      this.prepareData(this.props.nodes, this.props.edges);
    }
  }

  private showInternalNodes() {
    this.internalNodes = !this.internalNodes;
    if (this.props.nodes && this.props.edges) {
      this.prepareData(this.props.nodes, this.props.edges);
    }
  }

  private prepareData(n: DGNode[], e: DGLink[]) {
    const links: InternalLink[] = [];
    const nodes: InternalNode[] = [];
    const excludedNodes: number[] = [];

    for (const node of n) {
      if (!this.internalNodes && node.internal) {
        excludedNodes.push(node.id);
        continue;
      }

      nodes.push({
        id: node.id,
        name: node.name,
        internal: node.internal
      });
    }

    for (const link of e) {
      if (!this.internalEdges && !link.Type.includes("Def")) {
        continue;
      }

      if (
        excludedNodes.includes(link.id_source) ||
        excludedNodes.includes(link.id_target)
      ) {
        continue;
      }

      links.push({
        id: link.linkid,
        source: link.id_source,
        target: link.id_target,
        unproven: link.Type.includes("Unproven"),
        proven: link.Type.includes("Proven"),
        internal: !link.Type.includes("Def"),
        loops: false
      });
    }

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

  private updateGraphRender(links: InternalLink[], nodes: any) {
    this.base.remove();
    this.base = this.svg.append("g");
    this.base.attr("transform", this.currentZoomTransform);

    this.base
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    this.base
      .append("defs")
      .append("marker")
      .attr("id", "arrow-unproven")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    this.base
      .append("defs")
      .append("marker")
      .attr("id", "arrow-proven")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    this.link = this.base
      .append("g")
      .attr("class", "links")
      .selectAll(".line")
      .data(links)
      .enter()
      .append("path")
      .attr("stroke-width", 1)
      .attr("class", (l: InternalLink) => {
        if (l.unproven) {
          return "unproven";
        } else if (l.proven) {
          return "proven";
        } else {
          return "";
        }
      })
      .attr("marker-end", (l: InternalLink) => {
        if (l.unproven) {
          return "url(#arrow-unproven)";
        } else if (l.proven) {
          return "url(#arrow-proven)";
        } else {
          return "url(#arrow)";
        }
      });

    this.node = this.base
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag()
          .on("start", this.dragstarted.bind(this))
          .on("drag", this.dragged.bind(this))
          .on("end", this.dragended.bind(this))
      );

    this.node
      .append("circle")
      .attr("r", 5)
      .attr("class", (n: any) => {
        return n.internal ? "internal" : "";
      });

    this.node.append("title").text((d: any) => {
      return d.name;
    });

    this.node
      .filter((n: any) => {
        return !n.internal;
      })
      .append("text")
      .append("tspan")
      .attr("x", 7)
      .attr("y", 4)
      .text((n: any) => {
        return n.name;
      });

    this.simulation.alpha(1).restart();
    this.simulation.nodes(nodes).on("tick", this.ticked.bind(this));
    (this.simulation.force("link") as any).links(links);
  }

  private ticked() {
    this.link.attr("d", this.positionLink.bind(this));

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
      x: d.target.x - vec.x / len * 8,
      y: d.target.y - vec.y / len * 8
    };
  }

  private offsetLoop(d: any): { x: number; y: number } {
    const vec = { x: d.target.x - d.source.x, y: d.target.y - d.source.y };
    const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return {
      x: d.source.x + -vec.y / len * 20 + vec.x * 0.5,
      y: d.source.y + vec.x / len * 20 + vec.y * 0.5
    };
  }

  private shortenEndLoop(d: any) {
    const vec = { x: d.target.x - d.source.x, y: d.target.y - d.source.y };
    const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return {
      x: d.target.x + -vec.y / len * 7 - vec.x * 0.1,
      y: d.target.y + vec.x / len * 7 - vec.y * 0.1
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
}
