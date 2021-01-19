const { json } = require('body-parser');
const { Router } = require('express');
const Ldap = require('../models/Ldap');

const routes = new Router();

routes.get('/', (req, res) => {
  const {user, password} = req.body
  const ldap = new Ldap(user, password)
  if (!user||!password) {
    res.status(401).send({Error: 'Campo obrigatório não informado!'})
  }else{
    res.status(200).json(ldap.client.urls)
  }
})

routes.get('/usuarios', async (req, res) => {
  try {
    const { user, password, userSearch } = req.body;
    if (!user||!password) {
      res.status(401).send({Error: 'Campo obrigatório não informado!'})
    } else {
      const ldap = new Ldap(user, password);
      const options = {
        attributes: ['dn', 'cn', 'description', 'memberOf', 'employeeNumber', 'employeeID', 'otherMailbox', 'mobile'],
        scope: 'sub',
        filter: `(givenName=${userSearch})`
      };
      
      const busca = await ldap.search(`OU=USERS,OU=PEOPLE,DC=dccpm, DC=dev`, options)
      console.log(busca)
      if (!ldap&&!busca) {
        res.status(400).send({Error: 'Bind and search error!'}) 
      } else if (busca=='') {
        res.status(200).json({Resultado: 'Nenhum usuário localizado!'})
      } else {
        res.status(200).json(busca)
      }
    }
  } catch (error) {
    console.log(error)  
  }
})

routes.post('/usuarios', async (req, res) => {
  try {
    const { user, password, dn, entry } = req.body;  
    if (!dn||!entry) {
      res.status(400).json({Error: 'Parâmetro obrigatório não informado!'})
    } else {
      const ldap = await new Ldap(user, password)
      const criar = await ldap.add(dn, entry)
      console.log(`Criar: ${criar}`)
      res.status(201).json(criar)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

routes.get('/grupos', async (req, res) => {
  try {
    const { user, password, group } = req.body;
    if (!user||!password||!group) {
      res.status(401).send({Error: 'Campo obrigatório não informado!'})
    } else {
      const ldap = new Ldap(user, password);
      const options = {
        attributes: ['member'],
        scope: 'sub',
        filter: `(CN=${group})`
      };
      
      const busca = await ldap.search(`OU=GROUPS,OU=PEOPLE,DC=dccpm, DC=dev`, options)
      console.log(busca)
      if (!ldap&&!busca) {
        res.status(400).send({Error: 'Bind and search error!'}) 
      } else if (busca=='') {
        res.status(200).json({Resultado: 'Nenhum grupo localizado!'})
      } else {
        res.status(200).json(busca)
      }
    }
  } catch (error) {
    console.log(error)  
  }
})

module.exports = routes;