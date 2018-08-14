import * as React from "react";

import { Grid, Container } from "semantic-ui-react";

import { OpenUrl } from "../components/OpenUrl";
import { OpenFile } from "../components/OpenFile";
import VisibleInformationSidebar from "../containers/VisibleInformationSidebar";
import DataReceiverContainer from "../containers/DataReceiver";
import GraphRendererContainer from "../containers/GraphRenderer";
import VisibleStateButtons from "../containers/VisibleStateButtons";

import { IPCComm } from "../actions/IPCComm";

export default class App extends React.Component {
  render() {
    const localHets = IPCComm.localHets();
    return (
      <>
        <DataReceiverContainer />
        <Container fluid={true}>
          <Grid.Column>
            <Grid id="top" columns={3}>
              <Grid.Column floated="left" stretched width={6}>
                <VisibleStateButtons />
              </Grid.Column>
              {localHets ? (
                <>
                  <Grid.Column stretched floated="right" width={3}>
                    <OpenFile />
                  </Grid.Column>
                  <Grid.Column stretched floated="right" width={7}>
                    <OpenUrl />
                  </Grid.Column>
                </>
              ) : (
                <Grid.Column stretched floated="right" width={10}>
                  <OpenUrl />
                </Grid.Column>
              )}
            </Grid>
          </Grid.Column>
          <Grid columns={2}>
            <Grid.Column width={3} id="info_sidebar">
              <VisibleInformationSidebar />
            </Grid.Column>
            <Grid.Column width={13}>
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
