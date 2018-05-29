import * as React from "react";

import { Grid, Container } from "semantic-ui-react";

import { OpenUrl } from "../components/OpenUrl";
import { OpenFile } from "../components/OpenFile";
import VisibleInformationSidebar from "../containers/VisibleInformationSidebar";
import DataReceiverContainer from "../containers/DataReceiver";
import GraphRendererContainer from "../containers/GraphRenderer";

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
                <GraphRendererContainer />
              </Grid.Column>
            </Grid.Column>
          </Grid>
        </Container>
      </>
    );
  }
}
