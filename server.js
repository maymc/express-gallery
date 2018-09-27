const express = require('express');
const PORT = process.env.EXPRESS_CONTAINER_PORT;
const bodyParser = require('body-parser');
const app = express();

// const Tasks = require('./db/models/Tasks');
// const Users = require('./db/models/Users');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(process.env.EXPRESS_CONTAINER_PORT, () => {
  console.log(`Started app on port: ${process.env.EXPRESS_CONTAINER_PORT}`);
})