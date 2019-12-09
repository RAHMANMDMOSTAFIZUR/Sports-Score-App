//jshint esversion:8
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
router.use(express.static("public"));
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
//setting
router.get("/setting", (req,res)=>res.render("setting", {user:req.user}));
//edit
router.get("/edit", (req, res)=> res.render("edit", {user:req.user}));
//save function
router.post("/edit", (req,res)=>{
  const {name, email} = req.body;
  const changeId = {_id: req.body.id};
  const changeItem = {name:name, email:email};
  User.updateOne(changeId,changeItem,(err)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/setting");
    }
  });
});

router.post("/delete", (req, res) => {
  const deleteItem = req.body.id;
  User.findByIdAndDelete(deleteItem, (err) => {
    if (!err) {
      console.log("Successfully deleted");
      console.log(deleteItem);
      
      res.redirect("/users/login");
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
