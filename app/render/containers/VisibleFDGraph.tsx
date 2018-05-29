import { connect } from "react-redux";
import { FDGraph } from "../components/FDGraph";
import { HetsGuiState } from "../reducers/reducer";

type VisibleFDGraphProps = {
  width: number;
  height: number;
};

const mapStateToProps = (
  state: HetsGuiState,
  ownProps: VisibleFDGraphProps
) => {
  return {
    nodes: state.graph.nodes,
    edges: state.graph.edges,
    ...ownProps
  };
};

const VisibleFDGraph = connect(mapStateToProps)(FDGraph);

export default VisibleFDGraph;
