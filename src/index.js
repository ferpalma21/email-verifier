const dns = require('dns');
const disposableDomains = require('./disposableHosts');
const { checkInboxSMTP } = require('./smtpChecker');

/**
 * Check if email has a valid format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmailFormat(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Check if domain has MX records.
 * @param {string} domain
 * @returns {Promise<boolean>}
 */
function hasMXRecords(domain) {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}


/**
 * Check if is a disposable email has MX records.
 * @param {string} email
 * @returns {<boolean>}
 */

function isDisposableEmail(email) {
  const domain = email.split('@')[1].toLowerCase();
  return disposableDomains.includes(domain);
}


/**
 * Full email verification.
 * @param {string} email
 * @param {Object}[options] -Optional verification settings
 * @param {boolean}[options.checkInbox=false] Perform an smtp check
 * @param {boolean}[options.checkMX=false] Perform an smtp check
 * @returns {Promise<string>}
 */
async function verifyEmail(email, options = {checkInbox: false, checkMX: false}) {
  if (!isValidEmailFormat(email)) {
    console.error('❌ Invalid email format.');
    return false;
  }

  if (isDisposableEmail(email)){
    console.error('❌ Using disposable email.');
    return false
  }
  if (options.checkMX) {
    const domain = email.split('@')[1];
    const hasMX = await hasMXRecords(domain);

    if (!hasMX) {
      console.error(`❌ Domain does not have MX records.`);
      return false;
    }
  }

  if (options.checkInbox) {
    try {
      const inboxStatus = await checkInboxSMTP(email);
    } catch (e) {
      console.error(e);
      return false
    }
  }

  return true;
}

module.exports = verifyEmail
