const bcrypt = require('bcrypt');

// 仮組み
const TEST_BOOKS_DATABASE_DEFAULT = {
  books:[
    {id:1,'title':'本1','isbn':'9784088807232','is_rented':false},
    {id:2,'title':'本2','isbn':'9784088807553','is_rented':false},
    {id:3,'title':'本3','isbn':'9784088807959','is_rented':false},
    {id:4,'title':'本4','isbn':'9784088808260','is_rented':false},
    {id:5,'title':'本5','isbn':'9784088810263','is_rented':false},
    {id:6,'title':'本6','isbn':'9784088810768','is_rented':false},
    {id:7,'title':'本7','isbn':'9784088811932','is_rented':false},
    {id:8,'title':'本8','isbn':'9784088812120','is_rented':false},
    {id:9,'title':'本9','isbn':'9784088812830','is_rented':false},
    {id:10,'title':'本10','isbn':'9784088813554','is_rented':false},
    {id:11,'title':'本11','isbn':'9784088813998','is_rented':false},
    {id:12,'title':'本12','isbn':'9784088815404','is_rented':false},
    {id:13,'title':'本13','isbn':'9784088816265','is_rented':false},
    {id:14,'title':'本14','isbn':'9784088816951','is_rented':false},
    {id:15,'title':'本15','isbn':'9784088817996','is_rented':false},
    {id:16,'title':'本16','isbn':'9784088818672','is_rented':false},
    {id:17,'title':'本17','isbn':'9784088820804','is_rented':false},
    {id:18,'title':'本18','isbn':'9784088821412','is_rented':false},
    {id:19,'title':'本19','isbn':'9784088822044','is_rented':false},
    {id:20,'title':'本20','isbn':'9784088822822','is_rented':false},
    {id:21,'title':'本21','isbn':'9784088823065','is_rented':false},
    {id:22,'title':'本22','isbn':'9784088823492','is_rented':false},
    {id:23,'title':'本23','isbn':'9784088823638','is_rented':false},
    {id:24,'title':'本24','isbn':'9784088824246','is_rented':false},
    {id:25,'title':'本25','isbn':'9784089083819','is_rented':false},
    {id:26,'title':'本26','isbn':'9784089083796','is_rented':false},
    {id:27,'title':'本27','isbn':'9784088820439','is_rented':false},
    {id:28,'title':'本28','isbn':'9784088820842','is_rented':false},
    {id:29,'title':'本29','isbn':'9784087034738','is_rented':false},
    {id:30,'title':'本30','isbn':'9784087034851','is_rented':false},
    {id:31,'title':'本31','isbn':'9784087034981','is_rented':false},
    {id:32,'title':'本32','isbn':'9784083215858','is_rented':false},
    {id:33,'title':'本33','isbn':'9784083215957','is_rented':false},
    {id:34,'title':'本34','isbn':'9784083216039','is_rented':false},
    {
      'id':35,
      'title':'Wikipediaの例示',
      'isbn':'9783161484100',
      'is_rented':false
    },{
      'id':36,
      'title':'新・明快C言語 入門編',
      'isbn':'9784797377026',
      'is_rented':false
    },
    {id:37,'title':'Wikipediaの例示(10桁)','isbn':'4101092052','is_rented':false},

  ],
  'users':[{
    'id':1,
    'name':'c-gengo-kun',
    // hogefuga
    'password':'$2a$10$HtiJr6fb/pk6.S/8lQ5JMeR3QSKYA3cl.halLopw3GeRATC.yZtEC',
  },{
    'id':2,
    'name':'meijiro-kun',
    // piyopiyo
    'password':'$2a$10$U5.oQ/0lF30quYwQHSn.eesX6XVDpScLl65Bz/042MPnWAYfsyOkq',
  }
  ],
  'rent_ret_history':[{
    'book_id':1,
    'rent_time': new Date(2020, 0,1),
    'return_time': new Date(2020, 0,2),
    'user_id':1,
  },{
    'book_id':2,
    'rent_time': new Date(2019, 0,1),
    'return_time': new Date(2019, 0,2),
    'user_id':2,
  }
  ]
};

let TEST_BOOKS_DATABASE;
const initDetabase = async () =>{
  TEST_BOOKS_DATABASE = JSON.parse(JSON.stringify(TEST_BOOKS_DATABASE_DEFAULT));
};
initDetabase();

// ユーティリティ関数（切り分けようね）
// 本を探す string => 本データ|undefined
const findBooks = async (id) => {
  return TEST_BOOKS_DATABASE.books.find(x => x.id == id);
};

// 本のリストを返す number => 本リスト
const getBookList = async (cnt, start) =>{
  return {
    total:TEST_BOOKS_DATABASE.books.length,
    perpage: cnt,
    list:TEST_BOOKS_DATABASE.books.slice(start, start+cnt)
  };
};

// 本の存在確認(isbn)
const getBookFromISBN = async (isbn) => {
  return TEST_BOOKS_DATABASE.books.find(x=>x.isbn === isbn) !== undefined;
};

// 新しい本の追加
const addBook = async (title, isbn) => {
  const newbook = {
    id: TEST_BOOKS_DATABASE.books.length + 1,//1-index
    title, 
    isbn,
    is_rented: false
  };
  TEST_BOOKS_DATABASE.books.push(newbook);

  return newbook;
};

// 本の検索
const searchBooks = async (query, cnt, start) => {
  const hit = TEST_BOOKS_DATABASE.books
    .filter(x => x.title.indexOf(query)!==-1);

  return {
    total: hit.length,
    perpage: cnt,
    list:hit.slice(start, start+cnt)
  };
};

// 貸し出し
const rentBook = async (book_id, user_id) => {
  const targetBook = await findBooks(book_id);
  targetBook.is_rented=true;
  
  TEST_BOOKS_DATABASE.rent_ret_history.push({
    'book_id':book_id,
    'rent_time': new Date(),
    'return_time': null,
    'user_id': user_id,
  });
};

// 貸し出し中の本を取得
const getRentBooks = async (book_id, user_id) =>{
  return TEST_BOOKS_DATABASE.rent_ret_history.find(
    x => x.return_time===null &&
    x.user_id === user_id &&
    x.book_id === book_id);
};

// 本について貸し出し履歴を取得
const getRentAllBooksByBook = async (book_id, cnt, start) => {
  const rent_relations = TEST_BOOKS_DATABASE.rent_ret_history
    .filter(x => x.book_id === book_id).reverse();
  
  return {
    total: rent_relations.length,
    perpage: cnt,
    list:rent_relations.slice(start, start+cnt)
  };
};

// ユーザについて貸し出し履歴を取得
const getRentAllBooksByUser = async (user_id, cnt, start) => {
  const rent_relations = TEST_BOOKS_DATABASE.rent_ret_history
    .filter(x => x.user_id === user_id).reverse();
  
  return {
    total: rent_relations.length,
    perpage: cnt,
    list:rent_relations.slice(start, start+cnt)
  };
};


// 返却
const returnBook = async (book_id, user_id) => {
  const targetBook = await findBooks(book_id);
  targetBook.is_rented=false;
  const rent_history = await getRentBooks(book_id, user_id);
  rent_history.return_time = new Date();
};

// ユーザからユーザ情報を取得
const getUser = async (user_id) => {
  const user = TEST_BOOKS_DATABASE.users.find((x) => x.id === user_id);
  if(!user) return null;

  return user;
};


// ユーザ名とパスワードから認証
const confirmPassword = async (user_name, password, done) => {
  const foundUser = TEST_BOOKS_DATABASE.users.find((x)=>x.name === user_name);
  if(!foundUser) return done(null, false, {message: 'not found user'});
  
  const isCorrectPassword = await bcrypt.compare(password, foundUser.password);
  if(!isCorrectPassword) return done(null, false, {message: 'bad password'});

  return done(null, foundUser);
};

module.exports = {
  initDetabase,
  getBookList,
  getBookFromISBN,
  getUser,
  addBook,
  findBooks,
  searchBooks,
  rentBook,
  getRentBooks,
  returnBook,
  getRentAllBooksByBook,
  getRentAllBooksByUser,
  confirmPassword,
};
