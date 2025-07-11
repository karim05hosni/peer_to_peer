const net = require('net');
const rl = require('readline');

// Create CLI interface
const rlInterface = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const server = net.createServer(socket => {
    console.log('Client connected:', socket.remotePort);
});
server.listen(8080);
