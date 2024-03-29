const express = require("express");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const {UserModel}=require("../model/User.model")


const userRouter=express.Router()

//===========user Register=============//
userRouter.post("/register", async (req, res) => {
    const payload = req.body;
    const user = await UserModel.find({ email: payload.email });
    if (user.length == 0) {
      bcrypt.hash(payload.password, 5, async function (err, hash) {
        try {
          payload.password = hash;
          const user = new UserModel(payload);
          await user.save();
          res.send({ msg: "User created successfully", Info: user });
        } catch (error) {
          res.send({ msg: error.message });
        }
      });
    } else {
      res.send({ msg: "User already exist, please login", Info: user });
    }
  });
//==========user login============//
  userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.find({ email });
    bcrypt.compare(password, user[0].password, function (err, result) {
      if (result) {
        let token = jwt.sign(
          {
            userId: user[0]._id,
          },
          "sheetal",
          { expiresIn: "1h" }
        );
        res.send({ msg: "Login successful", Info: user, token: token });
      } else {
        res.send("Wrong Credentials! Please try again");
      }
    });
  });

module.exports={
    userRouter
}

