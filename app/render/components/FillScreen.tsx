import * as React from "react";
import { remote } from "electron";

type State = {
  width: number;
  height: number;
};

type Props = {
  children: (props: { width: number; height: number }) => JSX.Element;
};

export class FillScreen extends React.Component<Props, State> {
  timer: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      width: remote.getCurrentWindow().getContentSize()[0] - 16,
      height: remote.getCurrentWindow().getContentSize()[1] - 150
    };

    this.handleResize = this.handleResize.bind(this);

    remote.getCurrentWindow().on("resize", () => {
      clearTimeout(this.timer);
      // This error is not an error ¯\_(ツ)_/¯
      this.timer = setTimeout(this.handleResize, 50);
    });
  }

  private handleResize() {
    this.setState({
      width: remote.getCurrentWindow().getContentSize()[0] - 16,
      height: remote.getCurrentWindow().getContentSize()[1] - 150
    });
  }

  render() {
    const { children } = this.props;
    return children({
      width: this.state.width,
      height: this.state.height
    });
  }
}
