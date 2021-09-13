const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
  confirmPassword,
  getUser,
} = require('./util/accessdb');

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async(id, done) => {
    const user = await getUser(id);
    done(null, user);
  });
  passport.use(new LocalStrategy(confirmPassword));

  const SECRET_KEY = 'SECRET-KEY';
  app.use(session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialied: true,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/login', (req, res, next) => {
    passport.authenticate('local',
      {
        // なんかだめ
        // usernameField: 'name',
        // passwordField: 'password',
        // session: false
      },(err, user, info) => {
        if(err) return  res.status(400).json({message: 'なぜここでエラー？'});
        if(!user) return res.status(400).json({message: 'ログイン失敗'});
 
        //success
        return res.status(200).json({
          name: user.name,
        });
      })(req, res, next); 
  });
  app.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
      req.logout();
    }
    res.sendStatus(204);
  });
};
