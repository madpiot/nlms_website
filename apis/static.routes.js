'use strict';

import express from 'express';

let router = express.Router();

import {
    isUser,
    requires
} from './auth/auth.service';

router.get('/', function(req, res){
  res.render("index");
});

router.get('/login', function(req, res){
  if(req.session.user) {
    res.redirect("/dashboard");
  } else
    res.render("login", {error: ""});

});

router.get('/dashboard', isUser.authenticated, function(req, res) {
  res.render('dashboard', { title: 'User' });
});

router.get('/dashboard/mandals', isUser.authenticated, function(req, res) {
  res.render('mandals', { title: 'User' });
});

router.get('/dashboard/sellers', isUser.authenticated, function(req, res) {
  res.render('sellers', { title: 'User' });
});

router.get('/dashboard/reports', isUser.authenticated, function(req, res) {
  res.render('reports', { title: 'User', mandalUrl: '' });
});

router.get('/dashboard/sellers/add', isUser.authenticated, function(req, res) {
  res.render('add_seller', { title: 'User' });
});

router.get('/dashboard/sellers/:sellerID', isUser.authenticated, function(req, res) {
  res.render('seller_details', { title: 'User', sellerID: req.params.sellerID });
});

router.get('/dashboard/list/:mandalUrl?', isUser.authenticated, function(req, res) {
  res.render('list', { title: 'User', mandalUrl: req.params.mandalUrl || "all" });
});

router.get('/dashboard/nlms/add-new', isUser.authenticated, function(req, res) {
  res.render('add_new', { title: 'User' });
});

router.get('/dashboard/nlms/:id', isUser.authenticated, function(req, res) {
  res.render('details', { title: 'User', id: req.params.id, aadhaarNo: "" });
});

router.get('/dashboard/search/:aadhaarNo', isUser.authenticated, function(req, res) {
  res.render('details', { title: 'User', aadhaarNo: req.params.aadhaarNo, id: "" });
});

router.post('/dashboard/search', isUser.authenticated, function(req, res) {
  res.redirect("/dashboard/search/"+req.body.aadhaarNo)
});

export default router;
