const bcrypt = require('bcrypt');
const {
  getUserByName,
  createUser,
} = require('./accessdb');

// ユーザ名とパスワードから認証
const confirmPassword = async (user_name, password, done) => {
  const foundUser = await getUserByName(user_name);
  if(!foundUser) return done(null, false, {message: 'not found user'});
  
  const isCorrectPassword = await bcrypt.compare(password, foundUser.password);
  if(!isCorrectPassword) return done(null, false, {message: 'bad password'});

  return done(null, foundUser);
};

const saltRounds = 10;
// ハッシュ生成
const hashPasword = (password) => bcrypt.hashSync(password, saltRounds);

// ユーザ名とパスワードからサインアップ
const signupUser = async(username, password, done)=>{
  if(username===''){
    return done(null, false, {message:'ユーザ名が必要です'});
  }
  const existUser = await getUserByName(username);
  if(existUser){
    return done(null, false, {message:'すでに使用されているusernameです'});
  }
  if(password.length<8){
    return done(null, false, {message:'passwordは8文字以上にしましょう'});
  }
  const hashedPassword = hashPasword(password);

  return done(null, await createUser(username, hashedPassword));
};

module.exports={
  signupUser,
  confirmPassword,
};