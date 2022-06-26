'use strict';

const SMTPServer = require("smtp-server").SMTPServer;
const pino = require('pino')();

class Server {

    constructor() {

        this.port = process.env.SERVER_PORT || 8025;
        this.host = process.env.SERVER_HOST || '0.0.0.0';

        this.server = new SMTPServer({
            authMethods: ["CRAM-MD5"],
            onAuth: this.auth,
            onConnect: this.connect,
            onData: this.incoming,
        });

        this.server.on('error', this.onError);
        this.server.on('close', this.close);
    }

    listen() {
        return this.server.listen(this.port, undefined, this.onListen);
    }

    auth(auth, session, callback) {}

    connect(session, callback) {}

    close(session) {
        pino.info('shutdown smtp-server')
        pino.flush();
    }

    incoming(stream, session, callback) {}

    onError(error) {
        pino.error('err: %s', error)
    }

    onListen() {
        pino.info(`start smtp-server on %s:%d`, this.host, this.port);
    }
}

module.exports = {
    Server
};
