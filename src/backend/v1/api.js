'use strict';
const express = require('express');
const {
  getBookList,
  getBookFromISBN,
  addBook,
  findBooks,
  searchBooks,
  rentBook,
  getRentBooks,
  returnBook,
  getRentAllBooksByBook,
  getRentAllBooksByUser,
} = require('../../util/accessdb');
const ISBN = require('../../util/isbn');

// 必要に応じて切り分けてちょ

const router = express.Router();

// 一度のリクエストで返す個数
const RETCNT = 5;


// 本の一覧の取得
router.get('/books', async (req, res) => {
  const start = parseInt(req.query.start) || 0;
  res.json(await getBookList(RETCNT, start));
});

// 本の追加
router.put('/books', async (req, res) => {
  const title = req.body.title;
  const isbn = req.body.isbn;
  if(!ISBN.isJustifiable(isbn)){
    // 不適切なISBN
    return res.status(400).json({
      'errorMessage': 'bad ISBN'
    });
  }
  if(await getBookFromISBN(isbn)){
    return res.status(409).json({
      'errorMessage': 'すでにこの本は登録済みです'
    });
  }

  //新たな本の追加
  const newbook = await addBook(title, isbn);
  res.status(200).json(newbook);
});

// 本の検索
router.get('/books/search',async (req, res)=>{
  const q = req.query.q;
  const start = parseInt(req.query.start) || 0;
  res.json(await searchBooks(q, RETCNT, start));
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

// 本の情報の書き換え
router.post('/book/:id/edit',async (req,res) => {
  //本の検索
  const foundBook = await findBooks(req.params.id);

  if(!foundBook){
    res.status(404).json({
      'errorMessage': `'${req.params.id}' is not found`
    });

    return;
  }

  // エラーチェック
  // title
  if(req.body.title) {
    if(req.body.title === ''){
      res.status(400).json({
        'errorMessage': 'title must not empty'
      });

      return;
    }
  }
  // ISBN
  if(req.body.isbn) {
    if(!ISBN.isJustifiable(req.body.isbn)) {
      res.status(400).json({
        'errorMessage': 'bad ISBN'
      });

      return;
    }
  }
  // 変更
  if(req.body.title) {
    foundBook.title = req.body.title;
  }
  // isbn
  if(req.body.isbn) {
    foundBook.isbn = req.body.isbn;
  }
  res.status(200).json(foundBook);
});

// 本のレンタル
router.post('/book/:id/rent',async (req, res) => {
  if(!req.isAuthenticated() || !req.user){
    return res.status(403).json({
      message: 'ログインが必要です',
    });
  }
  //本の検索
  const targetBook = await findBooks(req.params.id);

  if(!targetBook){
    return res.status(404).json({
      'errorMessage': `'${req.params.id}' is not found`
    });
  }
  if(targetBook.is_rented){
    return res.status(409).json({
      'errorMessage': '貸出中'
    });
  }
  //本・ユーザが存在、現在貸し出し可能である
  //貸し出し履歴の追加
  rentBook(targetBook.id, req.user.id);
  res.sendStatus(204);
});

// 本の返却
router.post('/book/:id/return',async (req, res) => {
  if(!req.isAuthenticated() || !req.user){
    return res.status(403).json({
      message: 'ログインが必要です',
    });
  }
  //本の検索
  const targetBook = await findBooks(req.params.id);

  if(!targetBook){
    return res.status(404).json({
      'errorMessage': `'${req.params.id}' is not found`
    });
  }
  // 貸し出し履歴を取得
  const rent_history = await getRentBooks(targetBook.id, req.user.id);

  if(!targetBook.is_rented || !rent_history){
    return res.status(409).json({
      'errorMessage': 'あなたに貸出していない'
    });
  }
  //本・ユーザが存在、現在返却可能である
  await returnBook(targetBook.id, req.user.id);
  res.sendStatus(204);
});

// 本の貸し出し履歴
router.get('/book/:id/history', async (req, res) => {
  // これ降順のほうが嬉しいな
  const book_id = parseInt(req.params.id);
  const start = parseInt(req.query.start) || 0;
  res.json(await getRentAllBooksByBook(book_id, RETCNT, start));
});

// ユーザ情報
router.get('/user', async (req, res) => {
  if(!req.isAuthenticated() || !req.user){
    return res.status(403).json({
      message: 'ログインが必要です',
    });
  }
  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
  });
});


// ユーザの貸し出し履歴
router.get('/user/:user_id/history', async (req, res) => {
  if(!req.isAuthenticated() || !req.user){
    return res.status(403).json({
      message: 'ログインが必要です',
    });
  }
  if(req.user.id !== req.params.user_id){
    return res.status(403).json({
      message: 'アクセス権限がありません',
    });
  }
  // これ降順のほうが嬉しいな
  const start = parseInt(req.query.start) || 0;
  res.json(await getRentAllBooksByUser(req.params.user_id, RETCNT, start));
});


module.exports = router;
