const express=require('express');
const UserModel=require("../model/user.model");
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");
const authetication = require('../Middleware/authenticattion');
require("dotenv").config()
const app=express.Router();

// user Registration
app.post("/register", async (req, res) => {
    const { email, pass, name, age } = req.body;
    try {
      bcrypt.hash(pass, 5, async (err, secure_password) => {
        if (err) {
          console.log(err);
        } else {
          const user = new UserModel({ email, pass: secure_password, name, age });
          await user.save();
          res.status(200).json(user);
        }
      });
    } catch (err) {
        res.status(500).json(err);
    }
  });

// user Login
  app.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
      const user = await UserModel.find({ email: email });
      console.log(user);
      const hashed_pass=user[0].pass
      if (user.length > 0) {
        bcrypt.compare(pass, hashed_pass, (err, result) => {
          if (result) {
            const token = jwt.sign({ userID: user[0]._id }, process.env.secretkey);
            const option={
                httpOnly:true,
                maxAge:36000
            }
            res.status(200).cookie("token",token,option).json({token,user});
          } else {
            res.status(404).json("wrong credentials") 
          }
        });
      } else {
        res.status(500).json(" wrong Crendnitial");
      }
    } catch (err) {
      res.status(500).json("Email is wrong");
    }
  });

//  get user by id with middleware to authenticate the user
  app.get("/:id",authetication,async (req, res) => {  
    let id=req.params.id;
       id.toString()
    try{
      let notes = await UserModel.findOne({_id:id});
      res.status(200).json(notes);
  }
  catch(err){
      res.status(500).json(err.message);
  }
  });



  module.exports = app;







  // "name":"Deep",
  // "email":"dkits1995@gmail.com",
  // "pass":"deep@yadav",
  //  "age":26