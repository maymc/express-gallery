const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_CONTAINER_PORT;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// const Tasks = require('./db/models/Tasks');
// const Users = require('./db/models/Users');

//Tells Express to use a static directory that we define as the location to look for requests
app.use(express.static("public"));

//Returns already parsed info/object as "req.body"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Creates a simple Express app - basic way to register a Handlebars view engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//~~~~~~~ Routes ~~~~~~~~//
app.get("/", (req, res) => {
  res.render("home");
})



app.listen(PORT, () => {
  console.log(`Started app on port: ${PORT}`);
})