'use strict';
const express = require('express');
const ISBN = require('../util/isbn');

// 必要に応じて切り分けてちょ

const router = express.Router();

// 仮組み
// [TODO] ユーザ認証関係（現在はuser1固定）
const TEST_BOOKS_DATABASE = {
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
    'password':''
  },{
    'id':2,
    'name':'meijiro-kun',
    'password':''
  }
  ],
  'rent_ret_history':[{
    'book_id':1,
    'rent_time': new Date(2020, 0,1),
    'return_time': new Date(2020, 0,2),
    'user_id':1,
  }
  ]
};
const TEST_USER = TEST_BOOKS_DATABASE.users[0];

// 一度のリクエストで返す個数
const RETCNT = 5;

// ユーティリティ関数（切り分けようね）
// 本を探す string => 本データ|undefined
async function findBooks(id){
  return TEST_BOOKS_DATABASE.books.find(x => x.id == id);
}

// 本の一覧の取得
router.get('/books',(req, res) => {
  const start = parseInt(req.query.start) || 0;
  res.json({
    total:TEST_BOOKS_DATABASE.books.length,
    perpage: RETCNT,
    list:TEST_BOOKS_DATABASE.books.slice(start, start+RETCNT)
  });
});

// 本の追加
router.put('/books',(req, res) => {
  const title = req.body.title;
  const isbn = req.body.isbn;
  if(!ISBN.isJustifiable(isbn)){
    // 不適切なISBN
    res.status(400).json({
      'errorMessage': 'bad ISBN'
    });

    return;
  }
  if(TEST_BOOKS_DATABASE.books.find(x=>x.isbn === isbn)){
    res.status(409).json({
      'errorMessage': 'すでにこの本は登録済みです'
    });

    return;
  }

  //新たな本の追加
  const newbook = {
    id: TEST_BOOKS_DATABASE.books.length + 1,//1-index
    title, 
    isbn,
    is_rented: false
  };
  TEST_BOOKS_DATABASE.books.push(newbook);
  res.status(200).json(newbook);
});

// 本の検索
router.get('/books/search',(req, res)=>{
  const q = req.query.q;
  const hit = TEST_BOOKS_DATABASE.books.filter(x => x.title.indexOf(q)!==-1);
  const start = parseInt(req.query.start) || 0;
  res.json({
    total: hit.length,
    perpage: RETCNT,
    list:hit.slice(start, start+RETCNT)
  });
});


// 本の情報の取得
router.get('/book/:id',async (req,res) => {
  //本の検索
  const foundBook = await findBooks(req.params.id);

  if(foundBook){
    res.status(200).json(foundBook);
  }else{
    res.status(404).json({
      'errorMessage': `'${req.params.id}' is not found`
    });
  }
});

// 本のレンタル
router.post('/book/:id/rent',async (req, res) => {
  //本の検索
  const targetBook = await findBooks(req.params.id);

  if(!targetBook){
    res.status(404).json({
      'errorMessage': `'${req.params.id}' is not found`
    });

    return;
  }
  if(targetBook.is_rented){
    res.status(409).json({
      'errorMessage': '貸出中'
    });

    return;
  }
  //本・ユーザが存在、現在貸し出し可能である

  //貸し出し状況の変更
  targetBook.is_rented=true;
  
  //貸し出し履歴の追加
  TEST_BOOKS_DATABASE.rent_ret_history.push({
    'book_id':targetBook.id,
    'rent_time': new Date(),
    'return_time': null,
    'user_id': TEST_USER.id,
  });
  res.sendStatus(204);
});

// 本の返却
router.post('/book/:id/return',async (req, res) => {
  //本の検索
  const targetBook = await findBooks(req.params.id);

  if(!targetBook){
    res.status(404).json({
      'errorMessage': `'${req.params.id}' is not found`
    });

    return;
  }
  // 貸し出し履歴を取得
  const rent_history = TEST_BOOKS_DATABASE.rent_ret_history.find(x => x.return_time===null && x.user_id === TEST_USER.id);

  if(!targetBook.is_rented || !rent_history){
    res.status(409).json({
      'errorMessage': 'あなたに貸出していない'
    });

    return;
  }
  //本・ユーザが存在、現在返却可能である
  
  //貸し出し状況の変更
  targetBook.is_rented=false;
  
  //返却の記録
  rent_history.return_time = new Date();
  res.sendStatus(204);
});

// 貸し出し履歴
router.get('/user/:user_id/history', (req, res) => {
  // これ降順のほうが嬉しいな
  const rent_relations = TEST_BOOKS_DATABASE.rent_ret_history.filter(x => x.user_id === TEST_USER.id).reverse();
  const start = parseInt(req.query.start) || 0;
  res.json({
    total: rent_relations.length,
    perpage: RETCNT,
    list:rent_relations.slice(start, start+RETCNT)
  });
});


module.exports = router;