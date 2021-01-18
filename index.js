const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./controllers/index')
require('dotenv').config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(routes);

const port = 3030;

server.listen(port, console.log(`Success conection and port: ${port}`))