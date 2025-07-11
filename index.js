const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("are you a sender or receiver? (s/r)\n", (answer) => {
    if (answer.toLowerCase() === 's') {
        require('./sender');
    } else if (answer.toLowerCase() === 'r') {
        require('./receiver');
    } else {
        console.log("Invalid input. Please enter 's' for sender or 'r' for receiver.");
    }
    // rl.close();
});