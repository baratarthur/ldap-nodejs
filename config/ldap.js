const ldap = require('ldapjs');

const ldapConfig = ldap.createClient({url: 'ldap://192.168.2.250'});

module.exports = ldapConfig;
