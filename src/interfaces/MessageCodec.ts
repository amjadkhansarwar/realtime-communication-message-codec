  // Define the MessageCodec interface
 
 import { Message } from "../messages/Message";
 
 export interface MessageCodec {
  encode(message: Message): Uint8Array;
  decode(data: Uint8Array): Message;
}