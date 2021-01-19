const client = require('../config/ldap')

class Ldap {

  constructor(dn, password) {
    this.client = client;
    this.bind(dn, password);
  }

  bind(dn, password) {
    return new Promise((resolve, reject) => {
      const bind = this.client.bind(dn, password, err => {
        try {
          if (err) {
            console.log(`Error: ${err}`)
          } else {
            resolve(bind)
          }
        }
        catch (error) {
          reject(error)
        }
      })
    })
  }

  async add(dn, entry) {
    return await new Promise((resolve, reject) => {
      const addUser = this.client.add(dn, entry, err => {
        try {
          if (err) {
            console.log(`Error: ${err}`)
          } else {
            console.log(addUser)
            resolve(addUser)
          }
        } catch (error) {
          console.log(error)
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
          res.on('searchEntry', async function(entry) {
            const memberOf = await JSON.parse(entry);
            entries.push(memberOf);
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
              console.log(entries)
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