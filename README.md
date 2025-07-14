# Peer-to-Peer File Transfer

A simple peer-to-peer file transfer application built with Node.js to enhance understanding of networking concepts and Node.js streams.

## Overview

This project implements a basic peer-to-peer file transfer system where one node can send files to another node over a TCP connection. It demonstrates concepts like:

- TCP socket programming
- File streaming
- Buffer management
- Network protocols
- Handshake mechanisms

## Project Structure

```
peer_to_peer/
├── index.js      # Main entry point - asks user role
├── sender.js     # Handles file sending functionality
├── receiver.js   # Handles file receiving functionality
└── README.md     # This file
```

## How It Works

### Architecture
- **Sender**: Initiates connection and streams file data in chunks
- **Receiver**: Listens for incoming connections and reconstructs files
- **Protocol**: Custom binary protocol with JSON headers and file data

### File Transfer Process
1. **Handshake**: Sender sends file metadata (filename, size, chunk info)
2. **Chunked Transfer**: File is sent in 16KB chunks with headers
3. **Reconstruction**: Receiver assembles chunks back into the original file

## Usage

### Prerequisites
- Node.js installed on both machines
- Network connectivity between sender and receiver

### Running the Application

1. **Start the receiver first:**
   ```bash
   node index.js
   # Choose 'r' for receiver
   ```
   The receiver will start listening on port 8080.

2. **Start the sender:**
   ```bash
   node index.js
   # Choose 's' for sender
   ```
   You'll be prompted for:
   - Receiver's IP address
   - Path to the file you want to send

### Example Session

**Receiver side:**
```
are you a sender or receiver? (s/r)
r
Client connected: 12345
Received data: 1024 bytes
Received header: { type: 'handshake', filename: 'test.txt', ... }
```

**Sender side:**
```
are you a sender or receiver? (s/r)
s
Enter the receiver's IP address
192.168.1.100
Enter the file path
C:\path\to\file.txt
file exists
connected successfully
```

## Technical Details

### Protocol Format
Each packet consists of:
- **4 bytes**: Header length (uint32)
- **Header**: JSON metadata (handshake info or chunk info)
- **Data**: File chunk (for chunk packets only)

### Chunk Size
- Default chunk size: 16KB (16 * 1024 bytes)
- Configurable in `sender.js`

### Error Handling
- File existence validation
- Connection error handling
- Buffer overflow protection

## Learning Objectives

This project helps understand:
- **Node.js Streams**: File reading/writing streams
- **TCP Networking**: Socket creation and data transfer
- **Buffer Management**: Handling binary data and JSON parsing
- **Protocol Design**: Custom binary protocols with headers
- **Error Handling**: Network and file system error management

## Limitations
- Single file transfer at a time
- No encryption or authentication
- No resume capability for interrupted transfers
- Fixed port (8080) and chunk size
- Basic error handling

## Future Enhancements

- Multiple file transfer support
- Web UI
- Progress indicators
- Encryption
- Authentication
- Configurable ports and chunk sizes

## Dependencies

- Node.js built-in modules only:
  - `net` - TCP networking
  - `fs` - File system operations
  - `readline` - User input handling
  - `path` - File path utilities
  - `stream` - Stream operations

No external packages required! 