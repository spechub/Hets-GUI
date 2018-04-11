import { ipcRenderer } from "electron";

import * as React from "react";
import gql from "graphql-tag";
import ApolloClient from "apollo-boost";
import { Query } from "react-apollo";

import { ConfigDesc } from "../../shared/Types";

import { CONFIG_GET_CHANNEL } from "../../shared/SharedConstants";

export class QueryGraphQL extends React.Component<{}, {}> {
  private QUERY: any;

  constructor() {
    super({});

    const config = ipcRenderer.sendSync(CONFIG_GET_CHANNEL) as ConfigDesc;

    const link = new ApolloClient({
      uri: `http://${config.hets_hostname}:${config.hets_port}/graphql`
    });

    this.QUERY = gql`
      query DGraph($locId: String!) {
        dgraph(locId: $locId) {
          name
        }
      }
    `;
  }

  render() {
    return <Query query={this.QUERY} />;
  }
}

type Response = {
  dgraph: any;
};

type Variables = {
  locId: string;
};

const foo = graphql<{}, Response, Variables>(QUERY, {
  options: () => ({
    variables: {
      locId: "file:///home/ysengrimm/Desktop/Hets-lib/Basic/Algebra_I.casl"
    }
  })
});

export default () => {
  <ApolloProvider client={client}>foo()</ApolloProvider>;
};
