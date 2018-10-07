const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_CONTAINER_PORT;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');

//Linking gallery routes and authorization routes
const galleryRoutes = require('./routes/gallery.js');
const authRoutes = require('./routes/authRoutes.js');

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

//Setup for session
app.use(session({
  store: new RedisStore({ url: 'redis://redis-session-store:6379', logErrors: true }),
  //Secret is a random string used in algorithm to create keys. Random factor unique to your system
  secret: 'pancakes',
  //Resave means if there is no change, save it
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

//~~~~~~~ Routes ~~~~~~~~//

//Use Express router to access gallery routes
app.use('/', galleryRoutes);
app.use('/auth', authRoutes);




app.listen(PORT, () => {
  console.log(`Started app on port: ${PORT}`);
})