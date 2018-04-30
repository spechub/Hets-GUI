import * as React from "react";
import gql from "graphql-tag";

import { graphql, ChildProps } from "react-apollo";

import Oms from "./Oms";

type DGraph = {
  name: string;
  display_name: string;
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
  oms_list: [
    {
      display_name: string;
      label_has_free: boolean;
      label_has_hiding: boolean;
      loc_id: string;
      name: string;
      name_extension: string;
      name_extension_index: number;
      origin: string;
    }
  ];
};

type DGraphInputProps = {
  locId: string;
};

type DGraphResponse = {
  dgraph: DGraph;
};

const QUERY_DGRAPH = gql`
  query DGraph($locId: String!) {
    dgraph(locId: $locId) {
      name
      oms_list
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
    const { loading, error } = this.props.data;

    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    return <Oms sigId={1} />;
  }
}

export default withLocId(QueryDGraph);
