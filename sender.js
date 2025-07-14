const readline = require('readline');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const net = require('net');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Enter the receiver's IP address\n", (ipAddress) => {
    rl.question("Enter the file path\n", (filePath) => {
        const resolvedPath = path.resolve(filePath);

        fs.access(resolvedPath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log("File doesn't exist");
                rl.close();
                return;
            }
            console.log('file exists');
            const client = net.createConnection({ port: 8080, host: ipAddress }, () => {
                console.log("connected successfully");
                const totalChunks = Math.ceil(fs.statSync(resolvedPath).size / (16* 1024));

                const handshakeHeader = {
                    type: "handshake",
                    filename: path.basename(resolvedPath),
                    filesize: fs.statSync(resolvedPath).size,
                    fileExtension: path.extname(resolvedPath),
                    chunkSize: 16* 1024, // 32kb
                    totalChunks: totalChunks
                };

                const handshakeBuffer = Buffer.from(JSON.stringify(handshakeHeader));
                const handshakeLength = Buffer.alloc(4);
                handshakeLength.writeUInt32BE(handshakeBuffer.length);

                client.write(Buffer.concat([handshakeLength, handshakeBuffer]));

                let counter = 1;
                fs.createReadStream(resolvedPath, { highWaterMark: 16* 1024 })
                    .on('data', (chunk) => {
                        const chunkHeader = {
                            type: "chunk",
                            chunkNumber: counter,
                            chunkSize: chunk.length,
                            finalFlag: counter === totalChunks
                        };
                        const chunkHeaderBuffer = Buffer.from(JSON.stringify(chunkHeader));
                        const chunkHeaderLength = Buffer.alloc(4);
                        chunkHeaderLength.writeUInt32BE(chunkHeaderBuffer.length);

                        const packet = Buffer.concat([chunkHeaderLength, chunkHeaderBuffer, chunk]);
                        client.write(packet);

                        counter++;
                    });
            });
            rl.close();
        });
    });
});
