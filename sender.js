const readline = require('readline');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const net = require('net');

// Create CLI interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Enter the receiver's IP address\n", (ipAddress) => {
    rl.question("Enter the file path\n", (filePath) => {
        // Now both inputs are available here
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
                // Create a read stream and pipe to socket
                // fs.createReadStream(resolvedPath).pipe(client);
            });
            rl.close();
        });
    });
});
