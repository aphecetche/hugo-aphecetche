+++
author = ""
date = "2017-01-17"
description = ""
tags = [ "o2", "alice", "data", "format" ]
title = "O2 Data Formats"
+++

This page is to help me understand the O2 data formats.

## BaseHeader (32 bytes)

|                  | Type     | Equivalent char length | FieldName           | Description |
|----              | ---------|:----------------------:|-----------          |-------------|
| statically set   | uint32_t |    4                   | magicString         | a magic Id (to spot endianess and identify O2 header in a raw stream of bytes) | 
|                  | uint32_t |                        | headerSize          | size of the header (base + derived header) |
|                  | uint32_t |                        | flags               | to indicate if there is a sub header following |
| statically set   | uint32_t |                        | headerVersion       | |
| statically set   | uint64_t |    8                   | headerType          | header type / description (should be globally unique) | 
| statically set   | uint64_t |    8                   | serializationMethod | method of serialization of the _header itself_ (the part after the BaseHeader) |

## DataHeader (80 bytes) (32 from BaseHeader + 48 bytes DataHeader specific)

|                  | Type        | Equivalent char length | FieldName           | Description |
|----              | ---------   |:--------:|-----------          |-------------|
| statically set   | uint32_t    |    4                   | magicString         | a magic Id (to spot endianess and identify O2 header in a raw stream of bytes) | 
|                  | uint32_t    |                        | headerSize          | size of the header (base + derived header) |
|                  | uint32_t    |                        | flags               | to indicate if there is a sub header following |
| statically set   | uint32_t    |                        | headerVersion       | |
| statically set   | uint64_t    |    8                   | headerType          | header type (should be globally unique) | 
| statically set   | uint64_t    |    8                   | serializationMethod | method of serialization of the _header itself_ (the part after the BaseHeader) |
|                  |             |                        |                     |                         |
|                  | uint64_t[2] |   16                   | dataDescription     | data type descriptor    |
|                  | uint32_t    |    4                   | dataOrigin          | origin of the data (originating detector) |
|                  | uint32_t    |                        | reserved            |                         |
|                  | uint64_t    |    8                   | payloadSerializationMethod| serialization method _for the payload_ |
|                  | uint64_t    |                        | subSpecification    | det specific (e.g. link number) |
|                  | uint64_t    |                        | payloadSize         | size of associated data (in bytes ?) |

