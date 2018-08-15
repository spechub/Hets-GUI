import * as React from "react";
import * as dagreD3 from "dagre-d3";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IPCComm } from "../actions/IPCComm";
import { QUERY_CHANNEL_RESPONSE } from "../../shared/SharedConstants";
import { DGraphParser } from "../actions/DGraphParser";
import {
  changeGraphAction,
  showInternalAction
} from "../actions/HetsGuiActions";
import { constructGraph } from "../actions/GraphHelper";
import { DGNode, DGLink } from "../../shared/DGraph";

type DataReceiverProps = {
  onGraphLoaded: (
    graph: dagreD3.graphlib.Graph,
    nodes: DGNode[],
    edges: DGLink[]
  ) => void;
  resetHidden: () => void;
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
    if (!g.dgraph) {
      return;
    }

    const graph = constructGraph(g.dgraph.DGNodes, g.dgraph.DGLinks);
    this.props.resetHidden();
    this.props.onGraphLoaded(graph, g.dgraph.DGNodes, g.dgraph.DGLinks);
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
    onGraphLoaded: (
      graph: dagreD3.graphlib.Graph,
      nodes: DGNode[],
      edges: DGLink[]
    ) => {
      dispatch(changeGraphAction(graph, nodes, edges));
    },
    resetHidden: () => {
      dispatch(showInternalAction());
    }
  };
};

const DataReceiverContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataReceiver);

export default DataReceiverContainer;
