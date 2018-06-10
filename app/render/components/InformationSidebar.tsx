import * as React from "react";
import * as dagreD3 from "dagre-d3";
import { Button } from "semantic-ui-react";
import { Accordion } from "semantic-ui-react";
import { Theorem, Declaration, SenSymbol } from "../../shared/DGraph";
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
  rootPanels: any;

  constructor(props: InformationSidebarProps) {
    super(props);
  }

  render() {
    if (this.props.node) {
      let groupByKind: any = {};

      this.props.node.declarations.forEach((decl: Declaration) => {
        if (!groupByKind[decl.kind]) {
          groupByKind[decl.kind] = [];
        }
        groupByKind[decl.kind].push(decl.Symbol);
      });

      const declContent = Object.keys(groupByKind).map((key: string) => {
        return {
          title: key,
          content: groupByKind[key].map((op: string, i: number) => {
            return (
              <div key={i} className="text-mono">
                {op}
              </div>
            );
          })
        };
      });

      const theoContent = this.props.node.theorems.map((theo: Theorem) => {
        return {
          title: theo.name,
          content: theo.SenSymbols.map((sym: SenSymbol, i: number) => {
            return (
              <div key={i} className="text-mono">
                {sym.Symbol}
              </div>
            );
          })
        };
      });

      const DeclAccordion = (
        <>
          <Accordion.Accordion panels={declContent} exclusive={false} />
        </>
      );

      const TheoAccordion = (
        <>
          <Accordion.Accordion panels={theoContent} exclusive={false} />
        </>
      );

      this.rootPanels = [];
      if (this.props.node.theorems.length > 0) {
        this.rootPanels.push({
          title: "Theorems",
          content: { content: TheoAccordion, key: "content-1" }
        });
      }
      if (this.props.node.declarations.length > 0) {
        this.rootPanels.push({
          title: "Declarations",
          content: { content: DeclAccordion, key: "content-2" }
        });
      }
    }

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
            <Accordion panels={this.rootPanels} />
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
