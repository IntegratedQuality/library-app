const mysql = require('mysql');

// keyをテーブル名として、colのデータが入っている
const COLUMN_DATA = {
  book: {
    id: {
      required: false,
      type: 'number',
    },
    title: {
      required: true,
      type: 'string',
    },
    isbn: {
      required: false,
      type: 'string',
    },
    is_rented: {
      required: false,
      type: 'boolean',
    },
  },
  user: {
    id: {
      required: true,
      type: 'string',
    },
    name: {
      required: true,
      type: 'string',
    },
    password: {
      required: true,
      type: 'string',
    },
  },
  rent_ret_history: {
    book_id: {
      required: true,
      type: 'number',
    },
    rent_time: {
      required: true,
      type: 'object', // Date
    },
    return_time: {
      required: false,
      type: 'object', // Date
    },
    user_id: {
      required: true,
      type: 'strint',
    },
  }
};

const initializeTableIfNotExist = async (connection) => {
  // book テーブル作成
  await connection.query(
    'CREATE TABLE IF NOT EXISTS book (' +
    'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
    'title VARCHAR(255) NOT NULL,' +
    'isbn BIGINT DEFAULT NULL,' +
    'is_rented BOOLEAN NOT NULL DEFAULT FALSE' +
    ')'
  );

  // user テーブル作成
  await connection.query(
    'CREATE TABLE IF NOT EXISTS user (' +
    'id VARCHAR(255) NOT NULL PRIMARY KEY,' +
    'name VARCHAR(50) NOT NULL,' +
    'password VARCHAR(255) NOT NULL' +
    ')'
  );

  // rent_ret_history テーブル作成
  await connection.query(
    'CREATE TABLE IF NOT EXISTS rent_ret_history (' +
    'book_id INT NOT NULL,' +
    'rent_time DATETIME NOT NULL,' +
    'return_time DATETIME DEFAULT NULL,' +
    'user_id VARCHAR(255) NOT NULL' +
    ')'
  );

};

const getBookById = async (connection, id) => {
  const res = await connection.query(
    'SELECT * from book where id = ?', id
  );
  if (res.length >= 1) return res[0];
  else return null;
};

const getBooksByTitle = async (connection, title) => {
  return await connection.query(
    'SELECT * from book where title = ?',  title
  );
};

const getUserById = async (connection, id) => {
  const res = await connection.query(
    'SELECT * from user where id = ?', id
  );
  if (res.length >= 1) return res[0];
  else return null;
};

const getRentRetHistoryByBookId = async (connection, id) => {
  const res = await connection.query(
    'SELECT * from rent_ret_history where book_id = ?', id
  );
  if (res.length >= 1) return res[0];
  else return null;
};

const getRentRetHistoryByUserId = async (connection, id) => {
  const res = await connection.query(
    'SELECT * from rent_ret_history where user_id = ?', id
  );
  if (res.length >= 1) return res[0];
  else return null;
};

const _addData = async (connection, tableName, param) => {
  const cols = COLUMN_DATA[tableName];

  return await connection.query(`INSERT INTO ${tableName} SET ?`, param);
};

const addBook = async (connection, book) => {
  return await _addData(connection, 'book', book);
};

const addUser = async (connection, user) => {
  return await _addData(connection, 'user', user);
};

const addRentRetHistory = async (connection, rent_ret_history) => {
  return await _addData(connection, 'rent_ret_history', rent_ret_history);
};

module.exports = {
  initializeTableIfNotExist,
  getBookById,
  getBooksByTitle,
  getUserById,
  getRentRetHistoryByBookId,
  getRentRetHistoryByUserId,
  addBook,
  addUser,
  addRentRetHistory,
};
