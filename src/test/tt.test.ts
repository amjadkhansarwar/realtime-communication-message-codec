import SimpleMessageCodec from '../codecs/SimpleMessageCodec';
import { Message } from '../messages/Message';
import { TextEncoder, TextDecoder } from 'util'

describe('SimpleMessageCodec', () => {
  it('should encode and decode a message with headers and payload', () => {
    const codec = new SimpleMessageCodec();

    let originalMessage: Message = {
      headers: { Header1: 'Value1', Header2: 'Value2' },
      payload: new TextEncoder().encode('This is a sample payload.'),
    };

    const encodedData = codec.encode(originalMessage);
    const decodedMessage = codec.decode(encodedData);

    expect(decodedMessage).toEqual(originalMessage);
  });

})