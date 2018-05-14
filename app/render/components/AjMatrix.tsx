import * as React from "react";
import { Component } from "react";
import { DGraph } from "./graphql/DGraph";

type AjMatrixProps = {
  dgraph: DGraph;
};

export default class AjMatrix extends Component<AjMatrixProps, {}> {
  constructor(props: AjMatrixProps) {
    super(props);
  }

  render() {
    return (
      <>
        <h1>{this.props.dgraph.name}</h1>
        {this.props.dgraph.omsList.map((n, i) => {
          return <div key={i}>{n.displayName}</div>;
        })}
      </>
    );
  }
}
