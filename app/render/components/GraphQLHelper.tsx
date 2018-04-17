import * as React from "react";
import gql from "graphql-tag";

import { graphql, ChildProps } from "react-apollo";

type dgraph = {
  name: string;
};

type InputProps = {
  locId: string;
};

type Response = {
  dgraph: dgraph;
};

// type Variables = {
//   locId: string;
// };

const QUERY = gql`
  query DGraph($locId: String!) {
    dgraph(locId: $locId) {
      name
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
    return <div>`${dgraph}`</div>;
  }
}

export default withLocId(QueryGraphQL);
