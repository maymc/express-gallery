const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_CONTAINER_PORT || 3002;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

//Linking gallery routes
const galleryRoutes = require('./routes/gallery.js');

//Tells Express to use a static directory that we define as the location to look for requests
app.use(express.static("public"));

//Returns already parsed info/object as "req.body"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Creates a simple Express app - basic way to register a Handlebars view engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//Setup for method-override
app.use(methodOverride('_method'));

//~~~~~~~ Routes ~~~~~~~~//
// app.get("/", (req, res) => {
//   res.render("home");
// })

//Use Express router to access gallery routes
app.use('/', galleryRoutes);



app.listen(PORT, () => {
  console.log(`Started app on port: ${PORT}`);
})