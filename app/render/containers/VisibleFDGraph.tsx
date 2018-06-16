import { connect } from "react-redux";
import { FDGraph } from "../components/FDGraph";
import { HetsGuiState } from "../reducers/reducer";
import { Dispatch } from "redux";
import { selectNodeAction, selectEdgeAction } from "../actions/HetsGuiActions";

type VisibleFDGraphProps = {
  width: number;
  height: number;
};

const mapStateToProps = (
  state: HetsGuiState,
  ownProps: VisibleFDGraphProps
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
    },
    onSelectEdge: (edge: dagreD3.GraphEdge) => {
      dispatch(selectEdgeAction(edge));
    }
  };
};

const VisibleFDGraph = connect(
  mapStateToProps,
  mapDispatchToProps
)(FDGraph);

export default VisibleFDGraph;
