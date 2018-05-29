import * as React from "react";
import * as dagreD3 from "dagre-d3";
import { Button } from "semantic-ui-react";

export interface InformationSidebarProps {
  node: dagreD3.Node;
  edge: dagreD3.GraphEdge;
  hidden: boolean;
  onHideInternal: () => void;
  onShowInternal: () => void;
}

export class InformationSidebar extends React.Component<
  InformationSidebarProps,
  {}
> {
  constructor(props: InformationSidebarProps) {
    super(props);
  }

  render() {
    return (
      <>
        {this.props.hidden ? (
          <Button
            onClick={() => {
              this.props.onShowInternal();
            }}
          >
            Show internal
          </Button>
        ) : (
          <Button
            onClick={() => {
              this.props.onHideInternal();
            }}
          >
            Hide internal
          </Button>
        )}
        {this.props.node ? (
          <>
            <p>{this.props.node.label}</p>
            <p>{this.props.node.logic}</p>
            <p>
              {this.props.node.Reference
                ? this.props.node.Reference.library
                : ""}
            </p>
            <p>{this.props.node.declarations}</p>
            <p>{this.props.node.theorems}</p>
          </>
        ) : (
          <h3>no node selected :(</h3>
        )}
        {this.props.edge ? (
          <>
            <p>{this.props.edge.label}</p>
            <p>{this.props.edge.Type}</p>
            <p>{this.props.edge.ConsStatus} </p>
            <p>{this.props.edge.Rule}</p>
          </>
        ) : (
          <h3>no edge selected :(</h3>
        )}
      </>
    );
  }
}
