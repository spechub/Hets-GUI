import { connect } from "react-redux";
import { Dispatch } from "redux";
import { InformationSidebar } from "../components/InformationSidebar";
import { HetsGuiState, EGraphRenderer } from "../reducers/reducer";
import {
  hideInternalAction,
  showInternalAction,
  changeRendererAction
} from "../actions/HetsGuiActions";

const mapStateToProps = (state: HetsGuiState) => {
  return {
    node: state.selectedNode,
    edge: state.selectedEdge,
    hidden: state.internalHidden,
    renderer: state.openRenderer
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onHideInternal: () => {
      dispatch(hideInternalAction());
    },
    onShowInternal: () => {
      dispatch(showInternalAction());
    },
    onSwitchRenderer: (renderer: EGraphRenderer) => {
      dispatch(changeRendererAction(renderer));
    }
  };
};

const VisibleInformationSidebar = connect(mapStateToProps, mapDispatchToProps)(
  InformationSidebar
);

export default VisibleInformationSidebar;
