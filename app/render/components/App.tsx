import * as React from "react";

import { Grid, Container } from "semantic-ui-react";

import { OpenUrl } from "../components/OpenUrl";
// import { FDGraph } from "./components/FDGraph";
import { OpenFile } from "../components/OpenFile";
import { FillScreen } from "../components/FillScreen";
import VisibleDagGraph from "../containers/VisibleDagGraph";
import VisibleInformationSidebar from "../containers/VisibleInformationSidebar";
import DataReceiverContainer from "../containers/DataReceiver";

export default class App extends React.Component {
  render() {
    return (
      <>
        <DataReceiverContainer />
        <Container fluid={true}>
          <Grid columns={2}>
            <Grid.Column width={3} id="info_sidebar">
              <VisibleInformationSidebar />
            </Grid.Column>
            <Grid.Column width={13}>
              <Grid.Column>
                <Grid columns="equal" id="top">
                  <Grid.Column>
                    <OpenFile />
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <OpenUrl />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <FillScreen
                  children={props => <VisibleDagGraph {...props} />}
                />
                {/* <FDGraph
            width={(
              remote.getCurrentWindow().getContentSize()[0] - 16
            ).toString()}
            height={(
              remote.getCurrentWindow().getContentSize()[1] - 150
            ).toString()}
          /> */}
              </Grid.Column>
            </Grid.Column>
          </Grid>
        </Container>
      </>
    );
  }
}
