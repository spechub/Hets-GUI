import * as React from "react";
import gql from "graphql-tag";

import { graphql, ChildProps } from "react-apollo";

export type DGraph = {
  name: string;
  displayName: string;
  loc_id: string;
  version: string;
  document_links_source: [
    {
      source: {
        loc_id: string;
      };
      target: {
        loc_id: string;
      };
    }
  ];
  document_links_target: Array<any>; // TODO: needs more typing
  omsList: [
    {
      displayName: string;
      label_has_free: boolean;
      label_has_hiding: boolean;
      locId: string;
      name: string;
      name_extension: string;
      name_extension_index: number;
      origin: string;
    }
  ];
};

type DGraphInputProps = {
  locId: string;
  children: (props: { dgraph: DGraph }) => JSX.Element;
};

export type DGraphResponse = {
  dgraph: DGraph;
};

const QUERY_DGRAPH = gql`
  query DGraph($locId: String!) {
    dgraph(locId: $locId) {
      name
      ... on Library {
        omsList: oms(limit: null) {
          locId
          displayName
        }
      }
    }
  }
`;

const withLocId = graphql<DGraphInputProps, DGraphResponse>(QUERY_DGRAPH, {
  options: ({ locId }) => ({
    variables: { locId: locId }
  })
});

class QueryDGraph extends React.Component<
  ChildProps<DGraphInputProps, DGraphResponse>,
  {}
> {
  render() {
    const { loading, dgraph, error } = this.props.data;
    const { children } = this.props;

    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;

    return children({ dgraph });
  }
}

export default withLocId(QueryDGraph);
