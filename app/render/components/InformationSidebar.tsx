import * as React from "react";
import * as dagreD3 from "dagre-d3";

export interface InformationSidebarProps {
  node: dagreD3.Node;
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
        {this.props.node ? (
          <>
            <h3>{this.props.node.label}</h3>
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
      </>
    );
  }
}
