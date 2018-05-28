import { connect } from "react-redux";
import { InformationSidebar } from "../components/InformationSidebar";
import { HetsGuiState } from "../reducers/reducer";

const mapStateToProps = (state: HetsGuiState) => {
  return {
    node: state.selectedNode
  };
};

const VisibleInformationSidebar = connect(mapStateToProps)(InformationSidebar);

export default VisibleInformationSidebar;
