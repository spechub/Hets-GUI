import * as React from "react";
import gql from "graphql-tag";

import { graphql, ChildProps } from "react-apollo";
import { CSSProperties } from "react";

type OMS = {
  name: string;
  conservativity_status: {
    required: string;
    proved: string;
  };
};

type OmsInputProps = {
  locId: string;
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

const redText: CSSProperties = {
  color: "red"
};

class QueryOms extends React.Component<
  ChildProps<OmsInputProps, OmsResponse>,
  {}
> {
  render() {
    const { loading, oms, error } = this.props.data;
    if (loading) {
      return <div>loading oms</div>;
    }
    if (error) {
      console.log(error);
      return <div style={redText}>error oms {this.props.locId}</div>;
    }

    return <div>{oms.name}</div>;
  }
}

export default withOms(QueryOms);
