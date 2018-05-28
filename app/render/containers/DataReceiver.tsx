import * as React from "react";
import * as dagreD3 from "dagre-d3";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IPCComm } from "../actions/IPCComm";
import { QUERY_CHANNEL_RESPONSE } from "../../shared/SharedConstants";
import { DGraphParser } from "../actions/DGraphParser";
import { changeGraphAction } from "../actions/HetsGuiActions";

type DataReceiverProps = {
  onGraphLoaded: (graph: dagreD3.graphlib.Graph) => void;
};

class DataReceiver extends React.Component<DataReceiverProps, {}> {
  constructor(props: DataReceiverProps) {
    super(props);

    IPCComm.recieveMessage(
      QUERY_CHANNEL_RESPONSE,
      this.queryResponse.bind(this)
    );
  }

  private queryResponse(_e: any, s: any) {
    const g = new DGraphParser(s);
    const graph = this.constructGraph(g);

    this.props.onGraphLoaded(graph);
  }

  private constructGraph(g: DGraphParser): dagreD3.graphlib.Graph {
    const nodes = g.dgraph.DGNodes;
    const edges = g.dgraph.DGLinks;

    const graph = new dagreD3.graphlib.Graph()
      .setGraph({})
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
        style: n.reference ? "fill: #e0de6d" : ""
      });
    });

    edges.forEach(e => {
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

    return graph;
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onGraphLoaded: (graph: dagreD3.graphlib.Graph) => {
      dispatch(changeGraphAction(graph));
    }
  };
};

const DataReceiverContainer = connect(mapStateToProps, mapDispatchToProps)(
  DataReceiver
);

export default DataReceiverContainer;
