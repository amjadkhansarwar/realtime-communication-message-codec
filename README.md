# Simple Message Codec

Simple Message Codec is a TypeScript implementation of a binary encoding scheme for messages with headers and payload. It can be used in real-time communication applications for passing messages between peers.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Assumptions](#assumptions)
- [API](#api)
- [Usage](#usage)

## Introduction

This library provides a lightweight solution for encoding and decoding messages with headers and payload. It follows a simple binary encoding scheme tailored for real-time communication applications.

## Features

- Encode and decode messages with headers and payload.
- Simple binary encoding scheme.
- Limits on header and payload size to ensure message integrity.

## Installation

You can install the Simple Message Codec using npm:


## Assumptions

This implementation assumes the following:

A message can contain a variable number of headers and a binary payload.
Header names and values are ASCII-encoded strings, limited to 1023 bytes each.
A message can have a maximum of 63 headers.
The message payload is limited to 256 KiB.

## API

SimpleMessageCodec
constructor()
Creates a new instance of SimpleMessageCodec.

encode(message: Message): Uint8Array
Encodes a message into a Uint8Array.

decode(data: Uint8Array): Message
Decodes a Uint8Array into a message.

## Usage 

import { Message } from "../src/messages/Message"
import SimpleMessageCodec from "../src/codecs/SimpleMessageCodec"

// Create an instance of SimpleMessageCodec
const codec = new SimpleMessageCodec();

// Example Message
const originalMessage: Message = {
  headers: { Header1: 'Value1', Header2: 'Value2' },
  payload: new TextEncoder().encode('This is a sample payload.'),
};

// Encode a message
const encodedData = codec.encode(originalMessage);

// Decode the message
const decodedMessage = codec.decode(encodedData);

console.log(decodedMessage);

