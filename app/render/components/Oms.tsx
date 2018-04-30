import * as React from "react";
import gql from "graphql-tag";

import { graphql, ChildProps } from "react-apollo";

// type OMS = {
//   display_name: string;
//   conservativity_status: {
//     required: string;
//     proved: string;
//   };
// };

type SignatureMorphism = {
  id: number;
  source: {
    id: number;
  };
  target: {
    id: number;
  };
};

// type OmsInputProps = {
//   locId: string;
// };

type SignatureInputProps = {
  sigId: number;
};

// type OmsResponse = {
//   oms: OMS;
// };

type SignatureResponse = {
  signatureMorphism: SignatureMorphism;
};

const OMS_QUERY = gql`
  query Signature($id: Number!) {
    signature(id: $sigId) {
      id
    }
  }
`;

const withOms = graphql<SignatureInputProps, SignatureResponse>(OMS_QUERY, {
  options: ({ sigId }) => ({
    variables: { id: sigId }
  })
});

class QueryOms extends React.Component<
  ChildProps<SignatureInputProps, SignatureResponse>,
  {}
> {
  render() {
    const { loading, signatureMorphism, error } = this.props.data;
    if (loading) {
      return <div>loading</div>;
    }
    if (error) {
      console.log(error);
      return <div>error</div>;
    }

    return <div>{signatureMorphism}</div>;
  }
}

export default withOms(QueryOms);
