'use strict';

var Server = require('./src/smtp_server').Server;

function main() {

    var server = new Server();
    
    server.listen();
}

main();