const client = require('../config/ldap')

class Ldap {

  constructor(dn, password) {
    this.client = client;
    this.dn = dn;
    this.password = password;
  }

  bind(dn, password) {
    return new Promise((resolve, reject) => {
      this.client.bind(dn, password, (err, response) => {
        if (err) reject(err)
        else resolve(response)
      })
    })
  }

  add(dn, entry) {
    return new Promise((resolve, reject) => {
      this.bind(this.dn, this.password).then(
        info => {
          this.client.add(dn, entry, (err, res) => {
            if(err) reject(err)
            else resolve(res)
          });
        }
      ).catch(err => reject(err));
    })
  }

  del(dn) {
    return new Promise((resolve, reject) => {
       this.bind(this.dn, this.password).then(
        info => {
            this.client.del(dn, (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        }
      ).catch(err => reject(err));
    })
  }

  search(base, options) {
    return new Promise((resolve, reject) => {
      this.bind(this.dn, this.password).then(
        info => {
            this.client.search(base, options, (err, res) => {
                const entries = [];
                res.on('searchEntry', (entry) => {
                  const data = entry.toString()
                  entries.push(data);
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
            })
        }
      ).catch(err => reject(err));
    })
  }
}

module.exports = Ldap;
