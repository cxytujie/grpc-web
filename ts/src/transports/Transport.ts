import {BrowserHeaders} from "browser-headers";
import fetchRequest from "./fetch";
import xhrRequest from "./xhr";
import msStreamRequest from "./msStream";

declare const Response: any;
declare const Headers: any;

export interface Transport {
  (options: TransportOptions): void;
}

export type TransportOptions = {
  debug: boolean,
  url: string,
  headers: BrowserHeaders,
  credentials: string,
  body: ArrayBufferView,
  onHeaders: (headers: BrowserHeaders, status: number) => void,
  onChunk: (chunkBytes: Uint8Array, flush?: boolean) => void,
  onComplete: (err?: Error) => void,
}

let xhr: XMLHttpRequest;
function getXHR () {
  if (xhr !== undefined) return xhr;

  if (XMLHttpRequest) {
    xhr = new XMLHttpRequest();
    try {
      xhr.open('GET', 'https://example.com')
    } catch(e) {}
  }
  return xhr
}

function xhrSupportsResponseType(type: string) {
  const xhr = getXHR();
  if (!xhr) {
    return false;
  }
  try {
    xhr.responseType = type;
    return xhr.responseType === type;
  } catch (e) {}
  return false
}

export class DefaultTransportFactory {
  static selected: Transport;
  static getTransport(): Transport {
    if (!this.selected) {
      this.selected = DefaultTransportFactory.detectTransport();
    }
    return this.selected;
  }

  static detectTransport() {
    if (typeof Response !== "undefined" && Response.prototype.hasOwnProperty("body") && typeof Headers === "function") {
      return fetchRequest;
    }

    if (xhrSupportsResponseType("ms-stream")) {
      return msStreamRequest;
    }

    return xhrRequest;
  }
}