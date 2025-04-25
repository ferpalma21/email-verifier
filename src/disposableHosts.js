const fs = require('fs');

const filepath = './src/disposable-emails.txt'
const domains = fs.readFileSync(filepath, 'utf-8').split('\n');
module.exports = domains;
