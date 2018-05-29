import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as dagreD3 from "dagre-d3";

import { DagGraph } from "../components/DagGraph";
import { selectNodeAction } from "../actions/HetsGuiActions";
import { HetsGuiState } from "../reducers/reducer";

type VisibleDagGraphProps = {
  width: number;
  height: number;
};

const mapStateToProps = (
  state: HetsGuiState,
  ownProps: VisibleDagGraphProps
) => {
  return {
    graph: state.graph.dgraph,
    ...ownProps
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onSelectNode: (node: dagreD3.Node) => {
      dispatch(selectNodeAction(node));
    }
  };
};

const VisibleDagGraph = connect(mapStateToProps, mapDispatchToProps)(DagGraph);

export default VisibleDagGraph;
