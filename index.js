const ldap = require('ldapjs');

async function ldapBind(dn, password, starttls, ldapOpts) {
  return await new Promise((resolve, reject) => {
    const client = ldap.createClient(ldapOpts);
    ldapOpts.connectTimeout = ldapOpts.connectTimeout || 5000;
      client.bind(dn, password, (err) => {
        if (err) {
          reject(err)
          client.unbind()
          return
        }else{
          console.log('bind success!')
          resolve(ldapSearch(client))
        }
      })    
  })
}

const options = {
  //attributes: ['dn', 'cn', 'description', 'memberOf', 'employeeNumber', 'employeeID', 'otherMailbox', 'mobile'],
  scope: 'sub',
  filter: '(givenName=avivaldo)'
};

const ldapSearch = async (client) => {
  return await new Promise ((resolve, reject) => {
    client.search('OU=USERS,OU=PEOPLE,DC=dccpm,DC=local', options, (err, res) => {
      if (err) {
        reject(err)
      }else {
        
        const entries = [];

        res.on('searchEntry', function(entry) {
          console.log('entry: ' + JSON.stringify(entry.object));
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
            resolve(entries);
          }
        });
      }
    });
  })
}

ldapBind('avivaldo', '13222612@', null, {url: 'ldap://192.168.52.20'});

