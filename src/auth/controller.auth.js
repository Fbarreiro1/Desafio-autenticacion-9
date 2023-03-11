const { Router } = require('express');
const passport = require('passport');
const User = require('../dao/models/User.model');
const { isValidPasswordMethod, createHash } = require('../utils/cryptPassword');

const router = Router();

router.post(
  '/',
  passport.authenticate('login', { failureRedirect: 'auth/failLogin' }),
  async (req, res) => {
    try {
      if (!req.user)
        return res.status(400).json({ error: 'Credenciales invalidas' });

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
      };

      //res.send({ message: req.user });
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/failLogin', (req, res) => {
  console.log({ error: 'Falló el login' });
  res.send({ error: 'Falló el login' });
  
});

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: 'auth/login' }),
  async (req, res) => {
    req.session.user = req.user;
   
    res.redirect('/');
  }
);



router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) return res.json({ error });

    res.redirect('/');
  });
});

router.patch('/forgotPassword', async (req, res) => {
  try {
    const { email, password } = req.body;

    const passwordHashed = createHash(password);

    await User.updateOne({ email }, { password: passwordHashed });

    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;