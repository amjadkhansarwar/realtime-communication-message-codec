import SimpleMessageCodec from '../codecs/SimpleMessageCodec';
import { Message } from '../messages/Message';

describe('SimpleMessageCodec', () => {
  it('should encode and decode a message with headers and payload', () => {
    const codec = new SimpleMessageCodec();

    const originalMessage: Message = {
      headers: { Header1: 'Value1', Header2: 'Value2' },
      payload: new TextEncoder().encode('This is a sample payload.'),
    };

    const encodedData = codec.encode(originalMessage);
    const decodedMessage = codec.decode(encodedData);

    expect(decodedMessage).toEqual(originalMessage);
  });

  it('should handle Unicode characters in headers and payload', () => {
    const codec = new SimpleMessageCodec();

    const originalMessage: Message = {
      headers: { Header1: '😊UnicodeHead', Header2: 'Value2' },
      payload: new TextEncoder().encode('This is a 😊Unicode payload.'),
    };

    const encodedData = codec.encode(originalMessage);
    const decodedMessage = codec.decode(encodedData);

    expect(decodedMessage).toEqual(originalMessage);
  });

  it('should handle empty headers and payload', () => {
    const codec = new SimpleMessageCodec();

    const originalMessage: Message = {
      headers: {},
      payload: new Uint8Array(0),
    };

    const encodedData = codec.encode(originalMessage);
    const decodedMessage = codec.decode(encodedData);

    expect(decodedMessage).toEqual(originalMessage);
  });

  // Add more test cases as needed...
});
