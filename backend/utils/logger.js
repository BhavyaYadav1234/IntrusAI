const net = require('net');

const LOGSTASH_PORT = 5044;
const LOGSTASH_HOST = 'localhost';

const sendToLogstash = (logData) => {
    const client = new net.Socket();

    client.connect(LOGSTASH_PORT, LOGSTASH_HOST, () => {
        client.write(JSON.stringify(logData));
        client.end();
    });

    client.on('error', (err) => {
        console.error('Logstash connection error:', err);
    });
};

module.exports = { sendToLogstash };
