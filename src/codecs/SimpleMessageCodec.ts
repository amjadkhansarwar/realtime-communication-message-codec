import { Message } from "../messages/Message";
import { MessageCodec } from "../interfaces/MessageCodec";

/**
 * SimpleMessageCodec is an implementation of the MessageCodec interface
 * for encoding and decoding messages with headers and payload.
 */
class SimpleMessageCodec implements MessageCodec {
  // Constants
  private static MAX_HEADER_SIZE = 1023;
  private static MAX_HEADER_COUNT = 63;
  private static MAX_PAYLOAD_SIZE = 256 * 1024; // 256 KiB

  /**
   * Encodes a message into a Uint8Array.
   * @param message - The message to encode.
   * @returns The encoded message as a Uint8Array.
   * @throws Error if the message size exceeds the maximum allowed size.
   */
  encode(message: Message): Uint8Array {
    const totalSize = this.calculateTotalSize(message);
    const buffer = new Uint8Array(totalSize);
    let offset = this.encodeHeaders(message.headers, buffer, 0);
    this.encodePayload(message.payload, buffer, offset);
    return buffer;
  }

  /**
   * Decodes a Uint8Array into a message.
   * @param data - The encoded message as a Uint8Array.
   * @returns The decoded message.
   */
  decode(data: Uint8Array): Message {
    const headerCount = this.decodeHeaderCount(data);
    let offset = 2;

    const message: Message = {
      headers: {},
      payload: new Uint8Array(0),
    };

    for (let i = 0; i < headerCount; i++) {
      const header = this.decodeHeader(data, offset);
      offset = header.offset;
      message.headers[header.name] = header.value;
    }

    message.payload = this.decodePayload(data, offset);

    return message;
  }

  /**
   * Calculates the total size of a message.
   * @param message - The message to calculate the size for.
   * @returns The total size of the message.
   * @throws Error if the calculated size exceeds the maximum allowed size.
   */
  private calculateTotalSize(message: Message): number {
    const headerSize = this.calculateHeadersSize(message.headers);

    if (headerSize > SimpleMessageCodec.MAX_HEADER_SIZE) {
      throw new Error(`Exceeded maximum header size: ${SimpleMessageCodec.MAX_HEADER_SIZE}`);
    }

    const payloadSize = message.payload.length;

    if (payloadSize > SimpleMessageCodec.MAX_PAYLOAD_SIZE) {
      throw new Error(`Exceeded maximum payload size: ${SimpleMessageCodec.MAX_PAYLOAD_SIZE}`);
    }

    return 2 + headerSize + 4 + payloadSize;
  }

  /**
   * Calculates the size of the headers.
   * @param headers - The headers to calculate the size for.
   * @returns The size of the headers.
   * @throws Error if the header count or size exceeds the maximum allowed values.
   */
  private calculateHeadersSize(headers: Record<string, string>): number {
    const headerCount = Object.keys(headers).length;

    if (headerCount > SimpleMessageCodec.MAX_HEADER_COUNT) {
      throw new Error(`Exceeded maximum header count: ${SimpleMessageCodec.MAX_HEADER_COUNT}`);
    }

    return Object.keys(headers).reduce(
      (size, key) => size + 4 + this.utf8ByteLength(key) + 4 + this.utf8ByteLength(headers[key]),
      0
    );
  }

  /**
   * Calculates the UTF-8 byte length of a string.
   * @param str - The string to calculate the byte length for.
   * @returns The UTF-8 byte length of the string.
   */
  private utf8ByteLength(str: string): number {
    return new TextEncoder().encode(str).length;
  }

  /**
   * Encodes headers into the buffer.
   * @param headers - The headers to encode.
   * @param buffer - The buffer to write to.
   * @param offset - The starting offset in the buffer.
   * @returns The new offset after encoding the headers.
   */
  private encodeHeaders(headers: Record<string, string>, buffer: Uint8Array, offset: number): number {
    new DataView(buffer.buffer).setUint16(offset, Object.keys(headers).length);
    offset += 2;

    for (const [name, value] of Object.entries(headers)) {
      offset = this.encodeHeader(name, buffer, offset);
      offset = this.encodeHeader(value, buffer, offset);
    }

    return offset;
  }

  /**
   * Encodes a header value into the buffer.
   * @param value - The header value to encode.
   * @param buffer - The buffer to write to.
   * @param offset - The starting offset in the buffer.
   * @returns The new offset after encoding the header value.
   */
  private encodeHeader(value: string, buffer: Uint8Array, offset: number): number {
    const length = this.utf8ByteLength(value);

    new DataView(buffer.buffer).setUint16(offset, length);
    offset += 2;

    buffer.set(new TextEncoder().encode(value), offset);
    return offset + length;
  }

  /**
   * Encodes the payload into the buffer.
   * @param payload - The payload to encode.
   * @param buffer - The buffer to write to.
   * @param offset - The starting offset in the buffer.
   */
  private encodePayload(payload: Uint8Array, buffer: Uint8Array, offset: number): void {
    new DataView(buffer.buffer).setUint32(offset, payload.length);
    offset += 4;
    buffer.set(payload, offset);
  }

  /**
   * Decodes the header count from the data.
   * @param data - The encoded message as a Uint8Array.
   * @returns The decoded header count.
   */
  private decodeHeaderCount(data: Uint8Array): number {
    return new DataView(data.buffer).getUint16(0);
  }

  /**
   * Decodes a header from the data.
   * @param data - The encoded message as a Uint8Array.
   * @param offset - The current offset in the data.
   * @returns The decoded header and the new offset.
   */
  private decodeHeader(data: Uint8Array, offset: number): { name: string; value: string; offset: number } {
    const nameLength = new DataView(data.buffer).getUint16(offset);
    offset += 2;

    const name = new TextDecoder().decode(data.subarray(offset, offset + nameLength));
    offset += nameLength;

    const valueLength = new DataView(data.buffer).getUint16(offset);
    offset += 2;

    const value = new TextDecoder().decode(data.subarray(offset, offset + valueLength));
    offset += valueLength;

    return { name, value, offset };
  }

  /**
   * Decodes the payload from the data.
   * @param data - The encoded message as a Uint8Array.
   * @param offset - The current offset in the data.
   * @returns The decoded payload.
   */
  private decodePayload(data: Uint8Array, offset: number): Uint8Array {
    const payloadSize = new DataView(data.buffer).getUint32(offset);
    offset += 4;
    return data.subarray(offset, offset + payloadSize);
  }
}

export default SimpleMessageCodec;
