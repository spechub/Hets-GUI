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
      <h1>{this.props.node ? this.props.node.label : "no node selected :("}</h1>
    );
  }
}
