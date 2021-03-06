import { app, dialog, BrowserWindow, ipcMain, Event } from "electron";
import * as path from "path";
import * as url from "url";
import * as request from "request";

import { Utils } from "./utils";
import {
  QUERY_CHANNEL,
  QUERY_CHANNEL_RESPONSE,
  CONFIG_GET_CHANNEL,
  OPEN_FILE,
  OPEN_FILE_CANCEL
} from "./shared/SharedConstants";
import { URLType } from "./shared/Types";
import { StatusCode } from "./statuscodes";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 960, height: 600 });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on(QUERY_CHANNEL, (event: Event, message: any) => {
  const url = Utils.constructURL(
    message.hostname,
    message.port,
    message.file,
    message.type,
    message.command_list
  );

  request(
    url,
    { timeout: 2000 },
    (err: any, resp: request.Response, body: string) => {
      if (err) {
        if (err.code === "ETIMEDOUT") {
          dialog.showErrorBox(
            "Connection timed out!",
            "Hets could not be reached.\nPlease check that the adress and port in config.json are correct."
          );
        }

        if (err.code === "ECONNREFUSED") {
          dialog.showErrorBox(
            "Connection refused!",
            "Hets could not be reached.\nPlease check that the adress and port in config.json are correct."
          );
        }

        console.error(err);
        event.sender.send(QUERY_CHANNEL_RESPONSE, "");
        return;
      }

      if (resp.statusCode !== 200) {
        dialog.showErrorBox(
          `${StatusCode.fromCode(resp.statusCode)}!`,
          `Hets returned with error code: ${resp.statusCode}.`
        );

        console.error(
          `Status code: ${StatusCode.fromCode(resp.statusCode)} (${
            resp.statusCode
          })`
        );
        event.sender.send(QUERY_CHANNEL_RESPONSE, "");
        return;
      }

      event.sender.send(QUERY_CHANNEL_RESPONSE, JSON.parse(body));
    }
  );
});

ipcMain.on(CONFIG_GET_CHANNEL, (event: Event, _message: any) => {
  event.returnValue = Utils.getConfig();
});

ipcMain.on(OPEN_FILE, (event: Event, message: any) => {
  dialog.showOpenDialog(
    {
      filters: [
        { name: "Hets", extensions: ["dol", "casl", "het", "hpf", "thy"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile"]
    },
    (paths: string[]) => {
      if (paths === undefined) {
        event.sender.send(OPEN_FILE_CANCEL);
        return;
      }

      const path = paths[0];
      const url = Utils.constructURL(
        message.hostname,
        message.port,
        path,
        URLType.File,
        message.command_list
      );

      request(
        url,
        { timeout: 2000 },
        (err: any, resp: request.Response, body: string) => {
          if (err) {
            if (err.code === "ETIMEDOUT") {
              dialog.showErrorBox(
                "Connection timed out!",
                "Hets could not be reached.\nPlease check that the adress and port in config.json are correct."
              );
            }

            if (err.code === "ECONNREFUSED") {
              dialog.showErrorBox(
                "Connection refused!",
                "Hets could not be reached.\nPlease check that the adress and port in config.json are correct."
              );
            }

            console.error(err);
            event.sender.send(QUERY_CHANNEL_RESPONSE, "");
            return;
          }

          if (resp.statusCode !== 200) {
            dialog.showErrorBox(
              `${StatusCode.fromCode(resp.statusCode)}!`,
              `Hets returned with error code: ${resp.statusCode}.`
            );

            console.error(
              `Status code: ${StatusCode.fromCode(resp.statusCode)} (${
                resp.statusCode
              })`
            );
            event.sender.send(QUERY_CHANNEL_RESPONSE, "");
            return;
          }

          event.sender.send(QUERY_CHANNEL_RESPONSE, JSON.parse(body));
        }
      );
    }
  );
});
