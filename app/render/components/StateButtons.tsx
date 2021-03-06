import * as React from "react";
import * as dagreD3 from "dagre-d3";
import { Button } from "semantic-ui-react";

import { EGraphRenderer } from "../reducers/reducer";

export interface Props {
  hidden: boolean;
  renderer: EGraphRenderer;
  graph: dagreD3.graphlib.Graph;
  onHideInternal: () => void;
  onShowInternal: () => void;
  onSwitchRenderer: (renderer: EGraphRenderer) => void;
}

export class StateButtons extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Button.Group>
        {this.props.hidden ? (
          <Button
            onClick={() => {
              this.props.onShowInternal();
            }}
            disabled={this.props.graph === null}
          >
            Show Nodes
          </Button>
        ) : (
          <Button
            onClick={() => {
              this.props.onHideInternal();
            }}
            disabled={this.props.graph === null}
          >
            Hide Nodes
          </Button>
        )}

        {this.props.renderer === EGraphRenderer.GRAPHVIZ ? (
          <Button
            onClick={() => {
              this.props.onSwitchRenderer(EGraphRenderer.FORCE_DIRCETED);
            }}
          >
            Hierarchical layout
          </Button>
        ) : (
          <Button
            onClick={() => {
              this.props.onSwitchRenderer(EGraphRenderer.GRAPHVIZ);
            }}
          >
            Force-directed layout
          </Button>
        )}
      </Button.Group>
    );
  }
}
