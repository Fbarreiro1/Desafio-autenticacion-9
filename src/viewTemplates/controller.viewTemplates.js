const { Router } = require('express');
const { privateAccess, publicAccess } = require('../middlewares');

const router = Router();

router.get('/', privateAccess, (req, res) => {
  const { user } = req.session;
  res.render('profile.handlebars',{ style: "profile.css" ,user});
});

router.get('/login', publicAccess, (req, res) => {
  res.render('login.handlebars', { style: "login.css" });
});

router.get('/signup', publicAccess, (req, res) => {
  res.render('signup.handlebars', { style: "signup.css" });
});

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword.handlebars', { style: "forgotPassword.css" });
});

module.exports = router;