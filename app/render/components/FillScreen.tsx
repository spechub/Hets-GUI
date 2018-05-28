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
      // error shown in vscode but compiles just fine
      this.timer = setTimeout(this.handleResize, 50);
    });
  }

  componentDidMount() {
    this.handleResize();
  }

  private handleResize() {
    const sidebarWidth = document.querySelector("#info_sidebar").clientWidth;
    const topbarHeight = document.querySelector("#top").clientHeight;
    this.setState({
      width:
        remote.getCurrentWindow().getContentSize()[0] - (16 + sidebarWidth),
      height: remote.getCurrentWindow().getContentSize()[1] - (topbarHeight + 5)
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
