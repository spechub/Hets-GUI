import * as React from "react";
import * as dagreD3 from "dagre-d3";
import { Button } from "semantic-ui-react";
import { Theorem, Declaration } from "../../shared/DGraph";
import { EGraphRenderer } from "../reducers/reducer";

export interface InformationSidebarProps {
  node: dagreD3.Node;
  edge: dagreD3.GraphEdge;
  hidden: boolean;
  renderer: EGraphRenderer;
  onHideInternal: () => void;
  onShowInternal: () => void;
  onSwitchRenderer: (renderer: EGraphRenderer) => void;
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
        <p>
          {this.props.hidden ? (
            <Button
              onClick={() => {
                this.props.onShowInternal();
              }}
            >
              Show intermediate Nodes
            </Button>
          ) : (
            <Button
              onClick={() => {
                this.props.onHideInternal();
              }}
            >
              Hide intermediate Nodes
            </Button>
          )}
        </p>
        <p>
          {this.props.renderer === EGraphRenderer.GRAPHVIZ ? (
            <Button
              onClick={() => {
                this.props.onSwitchRenderer(EGraphRenderer.FORCE_DIRCETED);
              }}
            >
              switch to FD layout
            </Button>
          ) : (
            <Button
              onClick={() => {
                this.props.onSwitchRenderer(EGraphRenderer.GRAPHVIZ);
              }}
            >
              switch to graphviz layout
            </Button>
          )}
        </p>
        {this.props.node ? (
          <>
            <b>Node</b>
            <p>{"Name: " + this.props.node.label}</p>
            <p>{"Logic: " + this.props.node.logic}</p>
            <p>
              {this.props.node.Reference
                ? "Referenced from: " + this.props.node.Reference.library
                : ""}
            </p>
            <p>Declarations</p>
            <ul>
              {this.props.node.declarations.map(
                (decl: Declaration, i: number) => {
                  return <li key={i}>{decl.name}</li>;
                }
              )}
            </ul>
            <p>Theorems</p>
            <ul>
              {this.props.node.theorems.map((theo: Theorem, i: number) => {
                return <li key={i}>{theo.name}</li>;
              })}
            </ul>
          </>
        ) : (
          ""
        )}
        {this.props.edge ? (
          <>
            <b>Edge</b>
            <p>{this.props.edge.label}</p>
            <p>{"Type: " + this.props.edge.Type}</p>
            <p>
              {this.props.edge.ConsStatus
                ? "Cons status: " + this.props.edge.ConsStatus
                : ""}
            </p>
            <p>{this.props.edge.Rule ? "Rule: " + this.props.edge.Rule : ""}</p>
          </>
        ) : (
          ""
        )}
      </>
    );
  }
}
