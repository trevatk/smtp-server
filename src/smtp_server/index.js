'use strict';

const SMTPServer = require('smtp-server').SMTPServer;
const pino = require('pino')();
const process = require('process');

/**
 * SMTP wrapper class
 */
class Server {
  /**
   * Class initialization
   * @constructor
   */
  constructor() {
    this.port = process.env.SERVER_PORT || 8025;
    this.host = process.env.SERVER_HOST || '0.0.0.0';

    this.username = process.env.STMP_USERNAME || 'admin';
    this.password = process.env.SMTP_PASSWORD || 'P@ssw0rd#123$';

    this.server = new SMTPServer({
      authMethods: ['CRAM-MD5'],
      onAuth: this.auth,
      onConnect: this.connect,
      onData: this.incoming,
    });

    this.server.on('error', this.onError);
    this.server.on('close', this.close);
  }

  /**
   * Run SMTP server on specific host and port
   * @param {string} host
   * @param {string} port
   * @return {*}
   */
  listen(host, port) {
    return this.server.listen(port, undefined, this.onListen(host, port));
  }

  /**
   * Validate username/password provided before creating a connection
   * @param {*} auth
   * @param {*} session
   * @param {*} callback
   * @return {*} callback
   */
  auth(auth, session, callback) {
    if (auth.username != this.username || auth.password != this.password) {
      pino.error('invalid username or password provided');
      return callback(new Error('invalid username or password'));
    }

    return callback(null, {user: this.username});
  }

  /**
   * Validate and initialize client connection
   * @param {*} session
   * @param {*} callback
   * @return {*} callback
   */
  connect(session, callback) {
    if (session.remoteAddress != '127.0.0.1' ||
      session.remoteAddress != 'localhost') {
      pino.error('invalid remote host');
      return callback('invalid remote host');
    }

    return callback();
  }

  /**
   * Gracefully shutdown SMTP server
   * @param {*} session
   */
  close(session) {
    pino.info('shutdown smtp-server');
    pino.info(session);
    pino.flush();
  }

  /**
   * Validate and process incoming request
   * @param {*} stream
   * @param {*} session
   * @param {*} callback
   */
  incoming(stream, session, callback) {
    stream.pipe(process.stdout);
    stream.on('end', () => {
      return callback(null, 'message queued');
    });
  }

  /**
   * SMTP server logic and handle error emitted
   * @param {string} error
   */
  onError(error) {
    pino.error('err: %s', error);
  }

  /**
   * SMTP successfuly begin listening on server
   * @param {string} host
   * @param {string} port
   */
  onListen(host, port) {
    pino.info('start smtp-server on %s:%d', host, port);
  }
}

module.exports = {
  Server,
};
