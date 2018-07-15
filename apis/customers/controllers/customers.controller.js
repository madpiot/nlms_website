'use strict';

import emailValidator from "email-validator";
import mongoose from 'mongoose';

import CustomersService from '../services/customers.services';
import UsersService from '../../users/services/users.services';

import {
  generateJwtToken
} from "../../../common/utils";

import mandals from "../../../config/mandals.json";

// import data1 from "../../../config/data/Vemulapally.json";

const objectId = mongoose.Types.ObjectId;

// const insertMandal = (req, res) => {
//   let { type } = req.params;
//   let index = 1, length = 0;
//
//   data1.forEach((data) => {
//
//     // console.log(data);
//     let names = data.name.split("\n\n") || data.name.split("\n");
//     let mobiles = data.mobile.split("\n\n") || data.mobile.split("\n");
//     let genders = data.gender.split("\n\n") || data.gender.split("\n");
//     let incomes = data.income.split("\n\n") || data.income.split("\n");
//     let banks = data.bank.split("\n\n") || data.bank.split("\n");
//
//     if((names.length == 2) && (mobiles.length == 2) && (genders.length == 2) && (incomes.length == 2) && (banks.length == 2)) {
//       let customer = {
//         referenceID: parseInt(data.id),
//         name: names[0].trim(),
//         father: names[1].trim(),
//         aadhaar: parseInt(mobiles[0].trim()),
//         mobile: parseInt(mobiles[1].trim()),
//         address: {
//           village: data.address.trim(),
//           mandal: data.mandal.trim(),
//           district: "Nalgonda"
//         },
//         gender: genders[0].trim(),
//         caste: genders[1].trim(),
//         income: parseInt(incomes[0].trim()),
//         disability:  (parseInt(incomes[0].trim()))?true:false,
//         bank: {
//           name: banks[0].trim(),
//           ifsc: banks[1].trim(),
//           account: data.accno
//         },
//         appliedDate: data.appdate
//       }
//
//       if(type == "add") {
//         CustomersService.add(customer)
//         .then((response) => {
//           console.log("Saved: ", data.id);
//         })
//       } else if(type == "test") {
//         console.log("Correct: ", data.id);
//         console.log(index);
//       }
//       index++;
//     } else {
//       console.log("Incorrect Data: ", data.id);
//       console.log(data);
//     }
//
//     length ++;
//     if(length == data1.length)
//       res.json({length: data1.length})
//   });
//
// }

const add = (req, res) => {
  let body = req.body;
  CustomersService.count()
  .then((response) => {
    body.referenceID = response + 1;
    return CustomersService.add(body);
  })
  .then((response) => {
    res.redirect("/dashboard/nlms/"+response._id);
  })
  .catch((error) => {
    console.log(error);
    res.redirect("/dashboard/list/all");
  })
}

const update = (req, res) => {

  if(req.body._id)
    delete req.body._id;
  if(req.body.createdDate)
    delete req.body.createdDate;
  CustomersService.update({_id: objectId(req.params.userID)}, req.body)
  .then((response) => {
    res.status(200).json({ error: "0", message: "Customer Updated"});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const get = (req, res) => {

  CustomersService.findOne({_id: objectId(req.params.customerID)})
  .then((response) => {
    res.status(200).json({ error: "0", message: "Customer Data retrieved", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const search = (req, res) => {

  let { aadhaarNo } = req.body;
  CustomersService.findOne({aadhaar: parseInt(aadhaarNo)})
  .then((response) => {
    res.status(200).json({ error: "0", message: "Customer Data retrieved", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const getReports = (req, res) => {

  let { date } = req.body;
  console.log(req.body);
  CustomersService.reports({appliedDate: date})
  .then((response) => {
    res.status(200).json({ error: "0", message: "Customers Data retrieved", data: response});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

const getAll = (req, res) => {

  let { mandalUrl, limit, lastReferenceID } = req.body;

  let query = {};
  if(mandalUrl && (mandalUrl != "all")) {
    let index = mandals.map(function(mandal) { return mandal.url; }).indexOf(mandalUrl);
    let mandalName = mandals[index].name;
    query = {
      'address.mandal': mandalName
    }
  }

  limit = parseInt(limit) || 100;
  let total = 0;
  CustomersService.count(query)
  .then((response) => {
    total = response;
    query.referenceID =  { $gt: parseInt(lastReferenceID)};
    return CustomersService.find(query, limit, lastReferenceID );
  })
  .then((response) => {
    res.status(200).json({ error: "0", message: "Customers Data retrieved", data: response, total: total});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error:'1',message:"Internal Sever Error"});
  });
}

export default {
  add,
  getReports,
  update,
  get,
  search,
  getAll,
  //insertMandal
}
