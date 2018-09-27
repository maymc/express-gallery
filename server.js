const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.EXPRESS_CONTAINER_PORT;
const Tasks = require('./db/models/Tasks');
const Users = require('./db/models/Users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.listen(process.env.EXPRESS_CONTAINER_PORT, () => {
  console.log(`Started app on portL ${process.env.EXPRESS_CONTAINER_PORT}`);
})