import * as React from "react";
import { Accordion, List } from "semantic-ui-react";

import { Theorem, Declaration, SenSymbol, Axiom } from "../../shared/DGraph";
import { NodeLabel, EdgeLabel } from "../actions/GraphHelper";

export interface InformationSidebarProps {
  node: NodeLabel;
  edge: EdgeLabel;
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

      const declContent = Object.keys(groupByKind).map(
        (key: string, i: number) => {
          return {
            title: key,
            key: "decl-" + i,
            content: groupByKind[key].map((op: string, i: number) => {
              return (
                <div key={i} className="text-mono">
                  {op}
                </div>
              );
            })
          };
        }
      );

      const theoContent = this.props.node.theorems.map(
        (theo: Theorem, i: number) => {
          return {
            title: theo.name,
            key: "theo-" + i,
            content: [
              <div key={i} className="text-mono">
                {theo.Theorem}
              </div>
            ].concat(
              theo.SenSymbols.map((sym: SenSymbol, i: number) => {
                return (
                  <div key={i} className="text-mono">
                    {sym.Symbol}
                  </div>
                );
              })
            )
          };
        }
      );

      const axiomContent = this.props.node.axioms.map(
        (axiom: Axiom, i: number) => {
          return {
            title: axiom.name,
            key: "axiom-" + i,
            content: [
              <div key={"ax-" + i} className="text-mono">
                {axiom.Axiom}
              </div>
            ].concat(
              axiom.SenSymbols.map((sym: SenSymbol, i: number) => {
                return (
                  <div key={i} className="text-mono">
                    {sym.Symbol}
                  </div>
                );
              })
            )
          };
        }
      );

      const DeclAccordion = (
        <Accordion.Accordion panels={declContent} exclusive={false} />
      );

      const TheoAccordion = (
        <Accordion.Accordion panels={theoContent} exclusive={false} />
      );

      const AxiomAccordion = (
        <Accordion.Accordion panels={axiomContent} exclusive={false} />
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
      if (this.props.node.axioms.length > 0) {
        this.rootPanels.push({
          title: "Axioms",
          content: { content: AxiomAccordion, key: "axiom-content" }
        });
      }
    }

    return (
      <>
        {this.props.node ? (
          <>
            <h5>Node</h5>
            <p>{this.props.node.label}</p>
            <p>
              {this.props.node.logic ? (
                <>
                  <span>{"Logic: " + this.props.node.logic}</span>
                  <br />
                </>
              ) : (
                ""
              )}
              {this.props.node.Reference ? (
                <span>
                  {this.props.node.Reference
                    ? "Referenced from: " + this.props.node.Reference.library
                    : ""}
                </span>
              ) : (
                ""
              )}
            </p>
            <Accordion panels={this.rootPanels} />
          </>
        ) : (
          <>
            <h5>Node</h5>
            <p>Please select a node.</p>
          </>
        )}
        {this.props.edge ? (
          <>
            <h5>Edge</h5>
            {this.props.edge.label ? (
              <p>{this.props.edge.label}</p>
            ) : (
              <p>---</p>
            )}
            <p>
              {this.props.edge.Type ? (
                <>
                  <span>{"Type: " + this.props.edge.Type}</span>
                  <br />
                </>
              ) : (
                ""
              )}
              {this.props.edge.GMorphism &&
              this.props.edge.Type &&
              this.props.edge.Type.includes("HetDefInc") ? (
                <>
                  <span>{"Morphism:"}</span>
                  <List>
                    {this.props.edge.GMorphism.map((v: string, i: number) => {
                      return <List.Item key={"gmorph-" + i}>{v}</List.Item>;
                    })}
                  </List>
                  <br />
                </>
              ) : (
                ""
              )}
              {this.props.edge.ConsStatus ? (
                <>
                  <span>{"Cons status: " + this.props.edge.ConsStatus}</span>
                  <br />
                </>
              ) : (
                ""
              )}
              {this.props.edge.Rule ? (
                <>
                  <span>{"Rule: " + this.props.edge.Rule}</span>
                  <br />
                </>
              ) : (
                ""
              )}
            </p>
          </>
        ) : (
          <>
            <h5>Edge</h5>
            <p>Please select an edge.</p>
          </>
        )}
      </>
    );
  }
}
