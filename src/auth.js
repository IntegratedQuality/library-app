const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
  getUserById,
  changeUserName,
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
    const user = await getUserById(id);
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
    // store: ...
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  // サインアップ
  app.post('/api/v1/signup', (req, res) => {
    passport.authenticate('local-signup',
      {
        session: true
      },(err, user, info) => {
        if(err) return  res.status(400).json({message: 'なぜここでエラー？'});
        if(!user) return res.status(400).json(info);
        
        req.logIn(user, async (err) => {
          if(err) {
            return res.status(400).json({message: 'サインアップ失敗'});
          }

          const user = await changeUserName(req.user.id, req.body.screenname);

          return res.status(200).json({
            id: user.id,
            name: user.name,
          });
        });
      })(req, res);
  });
  
  app.post('/api/v1/login', (req, res, next) => {
    passport.authenticate('local',
      {
        session: true
      },(err, user, info) => {
        if(err) return  res.status(400).json({message: 'なぜここでエラー？'});
        if(!user) return res.status(400).json(info);
        
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
