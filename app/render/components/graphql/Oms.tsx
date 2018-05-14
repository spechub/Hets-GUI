import * as React from "react";
import gql from "graphql-tag";
import { graphql, ChildProps } from "react-apollo";

export type OMS = {
  name: string;
  conservativity_status: {
    required: string;
    proved: string;
  };
};

type OmsInputProps = {
  locId: string;
  children: (props: { oms: OMS }) => JSX.Element;
};

type OmsResponse = {
  oms: OMS;
};

const OMS_QUERY = gql`
  query OMS($locId: String!) {
    oms(locId: $locId) {
      name
    }
  }
`;

const withOms = graphql<OmsInputProps, OmsResponse>(OMS_QUERY, {
  options: ({ locId }) => ({
    variables: { locId: locId }
  })
});

class QueryOms extends React.Component<
  ChildProps<OmsInputProps, OmsResponse>,
  {}
> {
  render() {
    const { loading, oms, error } = this.props.data;
    const { children } = this.props;
    if (loading) {
      return <div>loading oms</div>;
    }
    if (error) {
      return <div>error</div>;
    }

    return children({ oms });
  }
}

export default withOms(QueryOms);
