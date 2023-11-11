
// Example usage:

import { TextEncoder, TextDecoder } from 'util'

import { Message } from "../src/messages/Message"
import SimpleMessageCodec from "../src/codecs/SimpleMessageCodec"

const codec = new SimpleMessageCodec();
    const messages: Message[] = [
      {
        headers: { Header1: 'Value1' },
        payload: new TextEncoder().encode('Payload1'),
      },
      {
        headers: { Header2: 'Value2' },
        payload: new TextEncoder().encode('ali'),
      },
      {
        headers: { Header3: 'Value3', Header4: 'value4'  },
        payload: new TextEncoder().encode('Amjad'),
      },
    ];


// Encode the give Message into 
messages.forEach(element => {
  
const encodedData = codec.encode(element)
const decodedMessage = codec.decode(encodedData)
// Convert payload to a human-readable string (assuming it's text-based)
const payloadString = new TextDecoder().decode(decodedMessage.payload)
console.log("Decoded Message:", decodedMessage.headers)
console.log(payloadString)
});



