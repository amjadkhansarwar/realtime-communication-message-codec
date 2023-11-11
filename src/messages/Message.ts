//  Define Message class

export class Message {
  public headers: Record<string, string>;
  public payload: Uint8Array;

  constructor(headers: Record<string, string>, payload: Uint8Array) {
    this.headers = headers;
    this.payload = payload;
  }
}
