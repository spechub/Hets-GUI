// import ApolloClient from "apollo-boost";
import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import { ConfigDesc } from "../../shared/Types";
import { ipcRenderer } from "electron";
import { CONFIG_GET_CHANNEL } from "../../shared/SharedConstants";

const config = ipcRenderer.sendSync(CONFIG_GET_CHANNEL) as ConfigDesc;

const link = createHttpLink({
  uri: `http://${config.hets_hostname}:${config.hets_port}/graphql`
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

const QUERY = gql`
  query DGraph($locId: String!) {
    dgraph(locId: $locId) {
      name
    }
  }
`;

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
