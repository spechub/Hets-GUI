import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import { ConfigDesc } from "../../shared/Types";
import { ipcRenderer } from "electron";
import { CONFIG_GET_CHANNEL } from "../../shared/SharedConstants";

export class TestGraphql {
  constructor() {
    const config = ipcRenderer.sendSync(CONFIG_GET_CHANNEL) as ConfigDesc;

    const client: any = new ApolloClient({
      uri: `http://${config.hets_hostname}:${config.hets_port}/graphql`
    });

    client
      .query({
        query: gql`
          {
            DGraph(
              locId: "file:///home/ysengrimm/Desktop/Hets-lib/Basic/Algebra_I.casl"
            )
          }
        `
      })
      .then((data: any) => console.log(data));
  }
}
