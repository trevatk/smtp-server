'use strict';

const Server = require('./src/smtp_server').Server;

/**
 * Run SMTP microservice
 */
function main() {
  const server = new Server();

  server.listen();
}

main();
