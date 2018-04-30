import * as React from "react";
import gql from "graphql-tag";

import { graphql, ChildProps } from "react-apollo";

type Dgraph = {
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

type InputProps = {
  locId: string;
};

type Response = {
  dgraph: Dgraph;
};

// type Variables = {
//   locId: string;
// };

const QUERY = gql`
  query DGraph($locId: String!) {
    dgraph(locId: $locId) {
      name
      oms_list
    }
  }
`;

const withLocId = graphql<InputProps, Response>(QUERY, {
  options: ({ locId }) => ({
    variables: { locId }
  })
});

// class AllPeopleQuery extends Query<dgraph, Variables> {}

class QueryGraphQL extends React.Component<
  ChildProps<InputProps, Response>,
  {}
> {
  render() {
    const { loading, dgraph, error } = this.props.data;
    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    return (
      <>
        <div>{dgraph.name}</div>
        <ul>
          {dgraph.oms_list.map(oms => {
            return <li>{oms.loc_id}</li>;
          })}
        </ul>
      </>
    );
  }
}

export default withLocId(QueryGraphQL);
