'use strict';

const Server = require('./src/smtp_server').Server;

/**
 * Run SMTP microservice
 */
function main() {
  const app = new Server();

  app.listen(app.host, app.port);
}

main();
