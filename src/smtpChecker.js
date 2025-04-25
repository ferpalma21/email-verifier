const dns = require('dns');
const net = require('net');

function checkInboxSMTP(email, from = 'test@test.com') {
  return new Promise((resolve, reject) => {
    const [_, domain] = email.split('@');

    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return reject('⚠️ No MX records found.');
      }

      const mx = addresses.sort((a, b) => a.priority - b.priority)[0].exchange;
      const socket = net.createConnection(25, mx);
      let stage = 0;

      socket.setEncoding('ascii');
      socket.setTimeout(5000);

      socket.on('data', (data) => {
        if (stage === 0 && data.startsWith('220')) {
          socket.write('HELO test.com\r\n');
          stage++;
        } else if (stage === 1 && data.startsWith('250')) {
          socket.write(`MAIL FROM:<${from}>\r\n`);
          stage++;
        } else if (stage === 2 && data.startsWith('250')) {
          socket.write(`RCPT TO:<${email}>\r\n`);
          stage++;
        } else if (stage === 3) {
          socket.end();
          if (data.startsWith('250')) {
            resolve('✅ Inbox appears to exist.');
          } else {
            reject('❌ Inbox does not exist or is protected.');
          }
        }
      });

      socket.on('timeout', () => {
        resolve('⚠️ Timeout during SMTP check.');
        socket.destroy();
      });

      socket.on('error', () => {
        resolve('⚠️ Error connecting to mail server.');
      });

      socket.on('end', () => {});
    });
  });
}

module.exports = { checkInboxSMTP };
