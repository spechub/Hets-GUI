import * as React from "react";
import { connect } from "react-redux";
import { EGraphRenderer, HetsGuiState } from "../reducers/reducer";
import VisibleDagGraph from "./VisibleDagGraph";
import { FillScreen } from "../components/FillScreen";
import VisibleFDGraph from "./VisibleFDGraph";

type GraphRendererProps = {
  renderer: EGraphRenderer;
};

class GraphRenderer extends React.Component<GraphRendererProps, {}> {
  constructor(props: GraphRendererProps) {
    super(props);
  }

  render() {
    if (this.props.renderer === EGraphRenderer.GRAPHVIZ) {
      return <FillScreen children={props => <VisibleDagGraph {...props} />} />;
    } else {
      return <FillScreen children={props => <VisibleFDGraph {...props} />} />;
    }
  }
}

const mapStateToProps = (state: HetsGuiState) => {
  return {
    renderer: state.openRenderer
  };
};

const GraphRendererContainer = connect(mapStateToProps)(GraphRenderer);

export default GraphRendererContainer;
