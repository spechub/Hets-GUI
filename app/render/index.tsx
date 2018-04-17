import { remote, ipcRenderer } from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Grid, Container } from "semantic-ui-react";

import { ConfigDesc } from "../shared/Types";
import { CONFIG_GET_CHANNEL } from "../shared/SharedConstants";
import { OpenUrl } from "./components/OpenUrl";
import { FDGraph } from "./components/FDGraph";
import { OpenFile } from "./components/OpenFile";
import GraphQLHelper from "./components/GraphQLHelper";

import "semantic-ui-css/semantic.min.css";

const config = ipcRenderer.sendSync(CONFIG_GET_CHANNEL) as ConfigDesc;
const client = new ApolloClient({
  uri: `http://${config.hets_hostname}:${config.hets_port}/graphql`
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <GraphQLHelper
      locId={"file:///home/ysengrimm/Desktop/Hets-lib/Basic/Algebra_I.casl"}
    />
    <Container fluid={true}>
      <Grid columns={1}>
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
          <FDGraph
            width={(
              remote.getCurrentWindow().getContentSize()[0] - 16
            ).toString()}
            height={(
              remote.getCurrentWindow().getContentSize()[1] - 150
            ).toString()}
          />
        </Grid.Column>
      </Grid>
    </Container>
  </ApolloProvider>,
  document.getElementById("content")
);
