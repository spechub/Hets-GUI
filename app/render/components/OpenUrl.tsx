import * as React from "react";
import { Button, Input } from "semantic-ui-react";

import { IPCComm } from "../actions/IPCComm";
import { URLType } from "../../shared/Types";
import { QUERY_CHANNEL_RESPONSE } from "../../shared/SharedConstants";

export interface OpenUrlState {
  filePath: string;
  loading: boolean;
}

export interface OpenUrlProps {}

export class OpenUrl extends React.Component<OpenUrlProps, OpenUrlState> {
  constructor(props: OpenUrlProps) {
    super(props);

    this.state = {
      filePath: "",
      loading: false
    };

    IPCComm.recieveMessage(QUERY_CHANNEL_RESPONSE, () => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <Input
        type="text"
        value={this.state.filePath}
        onChange={(e, d) => this.updateFilePath(e, d)}
        fluid={true}
        placeholder="Url or Path ..."
        action={true}
      >
        <input />
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          onClick={() => this.openFile()}
        >
          Open File
        </Button>
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          onClick={() => this.openWeb()}
        >
          Open Web
        </Button>
      </Input>
    );
  }

  private updateFilePath(
    _evt: React.SyntheticEvent<HTMLInputElement>,
    data: any
  ) {
    this.setState({
      filePath: data.value
    });
  }

  private openFile() {
    this.setState({ loading: true });
    IPCComm.queryHets(this.state.filePath, URLType.File);
  }

  private openWeb() {
    this.setState({ loading: true });
    IPCComm.queryHets(this.state.filePath, URLType.Web);
  }
}
