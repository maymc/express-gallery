const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_CONTAINER_PORT;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// const Tasks = require('./db/models/Tasks');
// const Users = require('./db/models/Users');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');





app.listen(PORT, () => {
  console.log(`Started app on port: ${PORT}`);
})