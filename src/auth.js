const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
  getUser,
} = require('./util/accessdb');
const {
  confirmPassword,
  signupUser,
} = require('./util/password');

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async(id, done) => {
    const user = await getUser(id);
    done(null, user);
  });
  // ログイン用ストラテジ
  passport.use(new LocalStrategy(confirmPassword));
  // サインアップストラテジ
  passport.use('local-signup', new LocalStrategy(signupUser));

  const SECRET_KEY = 'SECRET-KEY';
  app.use(session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: false,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  // サインアップ
  app.post('/api/v1/signup', (req, res, next) => {
    passport.authenticate('local-signup',
      {
        session: true
      },(err, user, info) => {
        if(err) return  res.status(400).json({message: 'なぜここでエラー？'});
        if(!user) return res.status(400).json({message: 'サインアップ失敗', info});
        
        req.logIn(user, (err) => {
          if(err) {
            return res.status(400).json({message: 'サインアップ失敗'});
          }

          return res.status(200).json({
            id: req.user.id,
            name: req.user.name,
          });
        });
        next();
      })(req, res, next);
  });
  
  app.post('/api/v1/login', (req, res, next) => {
    passport.authenticate('local',
      {
        session: true
      },(err, user, info) => {
        if(err) return  res.status(400).json({message: 'なぜここでエラー？'});
        if(!user) return res.status(400).json({message: 'ログイン失敗', info});
        
        req.logIn(user, (err) => {
          if(err) {
            return res.status(400).json({message: 'ログイン失敗'});
          }

          return res.status(200).json({
            id: req.user.id,
            name: req.user.name,
          });
        });
        next();
      })(req, res, next); 
  });
  app.post('/logout', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    req.logOut();
    req.session.destroy(()=>{
      res.clearCookie('connect.sid').sendStatus(200);
    });
  });
};
