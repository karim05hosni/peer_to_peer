const net = require('net');
const rl = require('readline');
const stream = require('stream');
const fs = require('fs');


// Create CLI interface
const rlInterface = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const server = net.createServer(socket => {
    console.log('Client connected:', socket.remotePort);
    let output;
    let BufferAccumulator = Buffer.alloc(0);
    socket.on('data', (data) => {
        console.log('Received data:', data.length, 'bytes');
        BufferAccumulator = Buffer.concat([BufferAccumulator, data]);
        while (BufferAccumulator.length >= 4) {
            const headerLength = BufferAccumulator.readUInt32BE(0);
            if (BufferAccumulator.length < 4 + headerLength) {
                console.log('Header is NOT complete, Waiting for more data...');
                break; // Wait for more data
            }
            const header = JSON.parse(Buffer.from(BufferAccumulator.subarray(4, 4 + headerLength)).toString());
            console.log('Received header:', header);
    
            let packetLength;
            if (header.type === "handshake") {
                output = fs.createWriteStream(header.filename);
                packetLength = 4 + headerLength; // No chunkSize for handshake
                BufferAccumulator = BufferAccumulator.subarray(packetLength);
                console.log('Processed packet:', header);
                continue; // Process next packet if any
            }
    
            if (header.type === "chunk") {
                packetLength = 4 + headerLength + header.chunkSize;
                if (BufferAccumulator.length < packetLength) {
                    console.log('We don’t have a complete packet, Waiting for more data...');
                    break; // Wait for more data
                }
                const fileData = BufferAccumulator.subarray(4 + headerLength, packetLength);
                console.log('\n---------------------------------------------------------------------------\n');
                output.write(fileData);
                BufferAccumulator = BufferAccumulator.subarray(packetLength);
                console.log('Processed packet:', header);
                if (header.finalFlag) {
                    console.log('File transfer complete.');
                    output.end();
                    socket.end();
                }
            }
        }
    });
    // socket.on('data', (data) => {
    //     console.log('Received data:', data.length, 'bytes');
    //     BufferAccumulator = Buffer.concat([BufferAccumulator, data]);
    //     // Check if we have enough data for the header
    //     if (BufferAccumulator.length < 4) {
    //         console.log('Not enough data for header, Waiting for more data...');
    //         return; // Wait for more data
    //     }
    //     const headerLength = BufferAccumulator.readUInt32BE(0);
    //     // Check if we have the complete header
    //     if (BufferAccumulator.length < 4 + headerLength) {
    //         console.log('Header is NOT complete, Waiting for more data...');
    //         return; // Wait for more data
    //     }
    //     const header = JSON.parse(Buffer.from(BufferAccumulator.subarray(4, 4 + headerLength)).toString());
    //     console.log('Received header:', header);
    //     if (header.type === "handshake"){
    //         output = fs.createWriteStream(header.filename);
    //     }
    //     const packetLength = 4 + headerLength + (header.chunkSize || 0);        
        
    //     if(header.type === "chunk") {
    //         // Check if we have the complete packet
    //         if (BufferAccumulator.length < packetLength) {
    //             console.log('we dont have complete packet,Waiting for more data...');
    //             return; // Wait for more data
    //         }
    //         const fileData = BufferAccumulator.subarray(4 + headerLength, packetLength);
    //         console.log('\n---------------------------------------------------------------------------\n')
    //         output.write(fileData);
    //     }
    //     // Remove the processed packet from the buffer
    //     BufferAccumulator = BufferAccumulator.subarray(packetLength);
    //     console.log('Processed packet:', header);
    //     if (header.finalFlag) {
    //         console.log('File transfer complete.');
    //         output.end();
    //         socket.end();
    //     }
    // });
    socket.on('end', () => {
        console.log('Client disconnected:', socket.remotePort);
    });
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});
server.listen(8080);


