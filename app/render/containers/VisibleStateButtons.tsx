import { connect } from "react-redux";
import { Dispatch } from "redux";

import { StateButtons } from "../components/StateButtons";
import { HetsGuiState, EGraphRenderer } from "../reducers/reducer";
import {
  hideInternalAction,
  showInternalAction,
  changeRendererAction
} from "../actions/HetsGuiActions";

const mapStateToProps = (state: HetsGuiState) => {
  return {
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

const VisibleInformationSidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(StateButtons);

export default VisibleInformationSidebar;
