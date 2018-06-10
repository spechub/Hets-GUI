import * as http from "http";
import * as querystring from "querystring";
import * as fs from "fs";
import * as path from "path";
import { CONFIG_FILENAME } from "./shared/SharedConstants";
import { URLType, ConfigDesc } from "./shared/Types";

interface HETSApiOptions {
  readonly hostname: string;
  readonly port?: number;
  readonly path: string;
}

export class Utils {
  public static async queryHETSApi(
    hostname: string,
    port: number,
    filepath: string,
    type: URLType,
    command_list: string
  ): Promise<JSON> {
    let escapedURL = "";
    let hetsApiOptions: HETSApiOptions;
    if (type === URLType.File) {
      escapedURL = querystring.escape("file:///" + filepath);
      hetsApiOptions = {
        hostname: hostname,
        port: port,
        path: `/dg/${escapedURL}/${command_list}?format=json`
      };
    } else if (type === URLType.Web) {
      escapedURL = querystring.escape(filepath);
      hetsApiOptions = {
        hostname: hostname,
        path: `/dg/${escapedURL}/?format=json`
      };
    } else {
      console.warn("Got URL of unsupported type!");
    }

    console.log(hetsApiOptions);

    try {
      return await this.getJSON(hetsApiOptions);
    } catch (err) {
      throw err;
    }
  }

  public static getConfig(): ConfigDesc {
    let filename = CONFIG_FILENAME;

    if (!fs.existsSync(path.join(__dirname, CONFIG_FILENAME))) {
      console.warn("WARN: No custom config.json found, using defaults!");
      filename = "config.json.example";
    }

    const configStr = fs.readFileSync(path.join(__dirname, filename), "utf8");

    return JSON.parse(configStr) as ConfigDesc;
  }

  public static setConfig(config: ConfigDesc) {
    if (!fs.existsSync(path.join(__dirname, CONFIG_FILENAME))) {
      console.warn(
        "WARN: No custom config.json found, a new one will be created!"
      );
    }

    fs.writeFileSync(
      path.join(__dirname, CONFIG_FILENAME),
      JSON.stringify(config, null, 2),
      "utf8"
    );
  }

  /**
   * Executes a standard GET request but returns a promise.
   * @param _options Object containing request parameters.
   */
  private static getJSON(options: HETSApiOptions): Promise<JSON> {
    return new Promise<JSON>((resolve, reject: (reason?: Error) => void) => {
      http
        .get(options, res => {
          const { statusCode } = res;
          const contentType = res.headers["content-type"];

          let error: Error;
          if (statusCode !== 200) {
            error = new Error(statusCode.toString());
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error(
              `Invalid content-type. Expected application/json but received ${contentType}`
            );
          }
          if (error) {
            // consume response data to free up memory
            res.resume();
            reject(error);
          }

          res.setEncoding("utf8");
          let rawData = "";
          res.on("data", chunk => {
            rawData += chunk;
          });
          res.on("end", () => {
            try {
              const parsedData = JSON.parse(rawData);
              resolve(parsedData);
            } catch (err) {
              reject(err);
            }
          });
        })
        .on("error", err => {
          reject(err);
        });
    });
  }
}
