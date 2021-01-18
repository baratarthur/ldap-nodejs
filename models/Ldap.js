const client = require('../config/ldap')

class Ldap {

  constructor(dn, password) {
    this.client = client;
    this.bind(dn, password);
  }

  bind(dn, password) {
    return new Promise((resolve, reject) => {
      const bind = this.client.bind(dn, password, (err) => {
        try {
         resolve(bind)
        }
        catch (error) {
          reject(error)
        }
      })
    })
  }

  async search(base, options) {
    return await new Promise((resolve, reject) => {
      this.client.search(base, options, (err, res) => {
        try {
          const entries = [];
          res.on('searchEntry', function(entry) {
            entries.push(entry);
          });
          res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
          });
          res.on('error', function(err) {
            console.error('error: ' + err.message);
          });
          res.on('end', function(result) {
            console.log('status: ' + result.status);
            if (result.status !== 0) {
              reject(new Error('Error code received from Active Directory'));
            } else {
              resolve(entries)
            }
          });
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}

module.exports = Ldap;