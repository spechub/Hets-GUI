import { ipcRenderer, Event } from "electron";

import {
  QUERY_CHANNEL,
  CONFIG_GET_CHANNEL,
  OPEN_FILE
} from "../../shared/SharedConstants";
import { URLType, ConfigDesc } from "../../shared/Types";

export class IPCComm {
  public static queryHets(file: string, type: URLType) {
    const config = ipcRenderer.sendSync(CONFIG_GET_CHANNEL) as ConfigDesc;

    const message = {
      file: file,
      hostname:
        type === URLType.File ? config.hets_hostname : config.hets_web_url,
      port: config.hets_port,
      type: type,
      command_list: ""
    };

    ipcRenderer.send(QUERY_CHANNEL, message);
  }

  public static recieveMessage(
    channel: string,
    callback: (e: Event, s: string) => void
  ) {
    ipcRenderer.on(channel, callback);
  }

  public static openFileDialog() {
    const config = ipcRenderer.sendSync(CONFIG_GET_CHANNEL) as ConfigDesc;
    const message = {
      hostname: config.hets_hostname,
      port: config.hets_port,
      command_list: ""
    };

    ipcRenderer.send(OPEN_FILE, message);
  }
}
