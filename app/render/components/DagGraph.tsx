import * as React from "react";
import * as d3 from "d3";
import * as dagreD3 from "dagre-d3";

export type DagGraphProps = {
  width: number;
  height: number;
  graph: dagreD3.graphlib.Graph;
  onSelectNode: (node: dagreD3.Node) => void;
  onSelectEdge: (edge: dagreD3.GraphEdge) => void;
};

export class DagGraph extends React.Component<DagGraphProps, {}> {
  baseSvg: SVGSVGElement;
  scale: { k: number; x: number; y: number };

  constructor(props: DagGraphProps) {
    super(props);

    this.scale = { k: 0.75, x: 0, y: 0 };

    this.displayGraph = this.displayGraph.bind(this);
  }

  componentDidMount() {
    this.displayGraph();
  }

  componentDidUpdate() {
    this.displayGraph();
  }

  private displayGraph() {
    if (!this.props.graph) {
      return;
    }

    const svg = d3.select(this.baseSvg);
    svg.selectAll("g").remove();
    const g = svg.append("g") as any;

    const zoom = d3.zoom().on("zoom", () => {
      g.attr("transform", d3.event.transform);
      this.scale = d3.event.transform;
    });
    svg.call(zoom);

    const graph = this.props.graph;

    const render = new dagreD3.render();
    render(g, graph);

    g.selectAll("g.node").on("click", (v: string) => {
      this.props.onSelectNode(graph.node(v));
      d3.event.stopPropagation();
    });

    g.selectAll("g.edgePath").on("click", (e: { v: string; w: string }) => {
      this.props.onSelectEdge(graph.edge(e));
      d3.event.stopPropagation();
    });

    svg.on("click", () => {
      this.props.onSelectEdge(null);
      this.props.onSelectNode(null);
      d3.event.stopPropagation();
    });

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(this.scale.x, this.scale.y).scale(this.scale.k)
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
