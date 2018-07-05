'use strict';

import emailValidator from "email-validator";

import UserService from '../services/users.services';

import {
  generateJwtToken
} from "../../../common/utils";

import mongoose from 'mongoose';

const objectId = mongoose.Types.ObjectId;

const register = (req, res) => {

   let { mobile, email } = req.body;

   UserService.create(req.body)
   .then((response) => {
      if(response){
        res.status(200).json({ error: "0", message: "User Register Successful", "data": response});
      }else{
        res.status(400).json({ error: "1", message: "User Registration Failed." });
      }
   })
   .catch((err) => {
     if(err.name == "ValidationError")
      res.status(400).json({error:'1',message:"Some Fields are missing."});
     else if(err.name == "MongoError")
      res.status(400).json({error:'1',message:"User Already Exists with same details"});
     else
      res.status(500).json({error:'1',message:"Internal Sever Error"});
   });

}


const login = (req, res) => {
  let { username, password } = req.body;
  console.log(req.body);
  if(username == "admin@nlms.com" && password == "nlms12345") {
    req.session.user = {
      username: "admin@nlms.com",
      name: "Admin"
    }
    res.redirect("/dashboard");
  } else
    res.redirect("/");
};

const logout = (req, res) => {
  req.session.user = null;
  res.redirect("/");
};

const addUser = (req,res) => {
  let requestFrom = req.headers["x-request-from"];

  let data = req.body;

  console.log(data);
  UserService.create(data)
  .then(response => {
    if(response) {
      res.status(200).json({error:'0',message:"New User detailes added successfully.", data: response});
    } else {
      res.status(400).json({error:'1',message:"Error in Adding New User"});
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const getAllUsers = (req,res) => {
  let requestFrom = req.headers["x-request-from"];

  let query = {};
  UserService.find(query)
  .then(response => {
    if(response) {
      res.status(200).json({error:'0',message:"Users Data", data: response});
    } else {
      res.status(400).json({error:'1',message:"No Users Exists in the database"});
    }
  })
  .catch(error => {
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

function getUserResponseData(data, requestFrom) {
  let userData = {
    _id: data._id,
    username: data.username,
    email: data.email,
    mobile: data.mobile,
    name: data.name,
    userType: data.userType
  };

  let response = { userData };
    response.token = generateJwtToken({ userID: data._id, username: data.username, userType: data.userType }, requestFrom);
  if(data.subUserType)
    response.subToken = generateJwtToken({ userID: data._id, username: data.username, userType: data.subUserType }, requestFrom);

  return response;
}

export default {
  register,
  login,
  logout,
  getAllUsers,
  addUser
}
