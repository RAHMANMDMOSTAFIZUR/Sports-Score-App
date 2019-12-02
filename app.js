// jshint esversion: 8
require("dotenv").config();
  
const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require('mongoose');

require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.get("/",  (req, res) => {
   res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/EPL", (req, res) => {
  res.render("EPL");
});
app.get("/fixtures", (req, res) => {
  res.render("fixtures");
});
app.get("/Football", (req, res) => {
  res.render("Football");
});
app.get("/matches", (req, res) => {
  res.render("matches");
});
app.get("/news", (req, res) => {
  res.render("news");
});
app.get("/scores", (req, res) => {
  res.render("scores");
});
app.get("/standings", (req, res) => {
  res.render("standings");
});
app.get("/team", (req, res) => {
  res.render("team");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
app.listen(4000, function(){
  console.log("server srarted on port 4000");
});


