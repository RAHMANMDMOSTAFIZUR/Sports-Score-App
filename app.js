// jshint esversion: 8
  require("dotenv").config();
  
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const override = require("method-override");
const users = [];

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(override("_method"));
app.use(passport.initialize());
app.use(passport.session());

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


app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/user", checkAuthenticated, (req, res) => {
  res.render("user", { users: users });
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashPass
    });
    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user");
  }

  next();
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
