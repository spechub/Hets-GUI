import * as React from "react";
import { Button } from "semantic-ui-react";

import { IPCComm } from "../actions/IPCComm";
import {
  QUERY_CHANNEL_RESPONSE,
  OPEN_FILE_CANCEL
} from "../../shared/SharedConstants";

interface OpenFileState {
  loading: boolean;
}

export class OpenFile extends React.Component<{}, OpenFileState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false
    };

    IPCComm.recieveMessage(QUERY_CHANNEL_RESPONSE, () => {
      this.setState({ loading: false });
    });

    IPCComm.recieveMessage(OPEN_FILE_CANCEL, () => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <Button
        loading={this.state.loading}
        disabled={this.state.loading}
        onClick={() => this.openFileDialog()}
      >
        Open File
      </Button>
    );
  }

  openFileDialog() {
    this.setState({ loading: true });
    IPCComm.openFileDialog();
  }
}
