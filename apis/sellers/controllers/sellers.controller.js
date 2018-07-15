'use strict';

import mongoose from 'mongoose';

import sellersService from '../services/sellers.services';

import {
  generateJwtToken
} from "../../../common/utils";

import mandals from "../../../config/mandals.json";

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let body = req.body;
  console.log(body);
  sellersService.add(body)
  .then((response) => {
    res.redirect("/dashboard/sellers/"+response._id);
  })
  .catch((error) => {
    res.redirect("/dashboard/sellers");
  })
}

const get = (req, res) => {
  sellersService.find({})
  .then((response) => {
    res.status(200).json({ error: "0", message: "Sellers Data retrieved", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const getData = (req, res) => {
  sellersService.findOne({_id: objectId(req.params.sellerID)})
  .then((response) => {
    res.status(200).json({ error: "0", message: "Seller Data retrieved", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const search = (req, res) => {
  let { aadhaar } = req.body;
  sellersService.findOne({aadhaar: parseInt(aadhaar)})
  .then((response) => {
    res.status(200).json({ error: "0", message: "Seller Data retrieved", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const update = (req, res) => {
  let { sellerID } = req.params;
  delete req.body._id;
  sellersService.update({_id: objectId(sellerID)}, req.body)
  .then((response) => {
    console.log(response);
    res.status(200).json({ error: "0", message: "Seller Data update", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

export default {
  get,
  update,
  getData,
  search,
  add
}
