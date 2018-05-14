import * as React from "react";
import * as ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
// import { Grid, Container } from "semantic-ui-react";

// import { OpenUrl } from "./components/OpenUrl";
// import { FDGraph } from "./components/FDGraph";
// import { OpenFile } from "./components/OpenFile";
import QueryDGraph from "./components/graphql/DGraph";
import AjMatrix from "./components/AjMatrix";

import "semantic-ui-css/semantic.min.css";

const client = new ApolloClient({
  uri: `http://localhost:8040/graphql`
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <QueryDGraph
      locId={"file:///home/ysengrimm/Desktop/Hets-lib/Basic/Algebra_I.casl"}
      children={props => <AjMatrix {...props} />}
    />
    {/*
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
    </Container> */}
  </ApolloProvider>,
  document.getElementById("content")
);
