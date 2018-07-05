'use strict';

import express from 'express';

let router = express.Router();

import {
    isUser,
    requires
} from './auth/auth.service';

router.get('/', function(req, res){
  if(req.session.user) {
    res.redirect("/dashboard");
  } else
    res.render("index");

});

router.get('/dashboard', isUser.authenticated, function(req, res) {
  res.render('dashboard', { title: 'User' });
});

router.get('/dashboard/list/:mandalUrl?', isUser.authenticated, function(req, res) {
  res.render('list', { title: 'User', mandalUrl: req.params.mandalUrl || "all" });
});

router.get('/dashboard/nlms/add-new', isUser.authenticated, function(req, res) {
  res.render('add_new', { title: 'User' });
});

router.get('/dashboard/nlms/:id', isUser.authenticated, function(req, res) {
  res.render('details', { title: 'User', id: req.params.id });
});

export default router;
