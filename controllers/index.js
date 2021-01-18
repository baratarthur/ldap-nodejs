const { json } = require('body-parser');
const { Router } = require('express');
const Ldap = require('../models/Ldap');

const routes = new Router();

routes.get('/', (req, res) => {
  const {user, password} = req.body
  const ldap = new Ldap(user, password)
  if (!ldap) {
    res.status(400).send({Error: 'Bind error!'})
  }else{
    res.status(200).json(ldap.client.urls)
  }
})

routes.get('/busca', async (req, res) => {
  try {
    const ldap = new Ldap('avivaldo', '123')
    const options = {
      attributes: ['dn', 'cn', 'description', 'memberOf', 'employeeNumber', 'employeeID', 'otherMailbox', 'mobile'],
      scope: 'sub',
      filter: '(givenName=*)'
    };
    
    const busca = await ldap.search('OU=DCC,OU=USERS,OU=PEOPLE,DC=dccpm, DC=dev', options)
    
    if (!ldap&&!busca) {
      res.status(400).send({Error: 'Bind and search error!'}) 
    } else {
      res.status(200).json(busca)
    }
  } catch (error) {
    console.log(error)  
  }
  
})

module.exports = routes;