import { connect } from "react-redux";
import { Dispatch } from "redux";
import { InformationSidebar } from "../components/InformationSidebar";
import { HetsGuiState } from "../reducers/reducer";
import {
  hideInternalAction,
  showInternalAction
} from "../actions/HetsGuiActions";

const mapStateToProps = (state: HetsGuiState) => {
  return {
    node: state.selectedNode,
    edge: state.selectedEdge,
    hidden: state.internalHidden
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onHideInternal: () => {
      dispatch(hideInternalAction());
    },
    onShowInternal: () => {
      dispatch(showInternalAction());
    }
  };
};

const VisibleInformationSidebar = connect(mapStateToProps, mapDispatchToProps)(
  InformationSidebar
);

export default VisibleInformationSidebar;
