import * as React from "react";
import { Button } from "semantic-ui-react";

import { EGraphRenderer } from "../reducers/reducer";

export interface Props {
  hidden: boolean;
  renderer: EGraphRenderer;
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
          >
            Show Nodes
          </Button>
        ) : (
          <Button
            onClick={() => {
              this.props.onHideInternal();
            }}
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
            Force-directed layout
          </Button>
        ) : (
          <Button
            onClick={() => {
              this.props.onSwitchRenderer(EGraphRenderer.GRAPHVIZ);
            }}
          >
            Hierarchical layout
          </Button>
        )}
      </Button.Group>
    );
  }
}
