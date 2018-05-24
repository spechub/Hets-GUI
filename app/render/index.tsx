import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, Container } from "semantic-ui-react";

import { OpenUrl } from "./components/OpenUrl";
// import { FDGraph } from "./components/FDGraph";
import { OpenFile } from "./components/OpenFile";
import { DagGraph } from "./components/DagGraph";

import "semantic-ui-css/semantic.min.css";
import { FillScreen } from "./components/FillScreen";

ReactDOM.render(
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
        <FillScreen children={props => <DagGraph {...props} />} />
        {/* <FDGraph
          width={(
            remote.getCurrentWindow().getContentSize()[0] - 16
          ).toString()}
          height={(
            remote.getCurrentWindow().getContentSize()[1] - 150
          ).toString()}
        /> */}
      </Grid.Column>
    </Grid>
  </Container>,
  document.getElementById("content")
);
