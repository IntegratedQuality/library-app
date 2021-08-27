const util = require('util');
const mysql = require('mysql');
const {
  initializeTableIfNotExist,
  getBookById,
  getBooksByTitle,
  getUserById,
  getRentRetHistoryByBookId,
  getRentRetHistoryByUserId,
  addBook,
  addUser,
  addRentRetHistory,
} = require('../src/backend/db');

let connection;

beforeEach(async () => {
  connection = await mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'rootpass',
    database: 'lib_db_test',
    charset: 'utf8'
  });
  connection.query = util.promisify(connection.query);
  await connection.query('DROP TABLE IF EXISTS book');
  await connection.query('DROP TABLE IF EXISTS user');
  await connection.query('DROP TABLE IF EXISTS rent_ret_history');
  await initializeTableIfNotExist(connection);
});

afterEach(() => {
  connection.end();
});

test('book insert get', async () => {
  await addBook(connection, {
    title: 'book0',
    isbn: 100000000
  });
  await addBook(connection, {
    title: 'book1',
    isbn: 200000000
  });
  const booksByTitle = await getBooksByTitle(connection, 'book0');
  expect(booksByTitle.length).toEqual(1);
  const book0ById = await getBookById(connection, booksByTitle[0].id);
  expect(booksByTitle[0]).toStrictEqual(book0ById);
  expect(book0ById.title).toEqual('book0');
  expect(book0ById.isbn).toEqual(100000000);
  expect(await getBooksByTitle(connection, 'notfound')).toEqual([]);
});

test('user insert get', async () => {
  await addUser(connection, {
    id: 'testman',
    name: 'test',
    password: 'password'
  });
  await addUser(connection, {
    id: 'testma_man',
    name: 'test_maman',
    password: 'passwordn'
  });
  const resBooks = await getUserById(connection, 'testman');
  expect(resBooks.id).toEqual('testman');
  expect(resBooks.name).toEqual('test');
  expect(resBooks.password).toEqual('password');
  expect(await getUserById(connection, 'notfound')).toEqual(null);
});

test('rent_ret_history insert get', async () => {
  await addRentRetHistory(connection, {
    book_id: 10,
    user_id: 'uid0',
    rent_time: new Date('2020-2-2 2:00:00'),
    return_time: null
  });
  await addRentRetHistory(connection, {
    book_id: 100,
    user_id: 'uid1',
    rent_time:  new Date('2021-2-2 2:-0:00'),
    return_time: new Date('2021-2-2 2:30:00'),
  });

  const b0ByBookId = await getRentRetHistoryByBookId(connection, 10);
  const b0ByUserId = await getRentRetHistoryByUserId(connection, 'uid0');
  expect(b0ByBookId).toStrictEqual(b0ByUserId);
  expect(b0ByBookId.book_id).toEqual(10);
  expect(b0ByBookId.user_id).toEqual('uid0');
  expect(b0ByBookId.rent_time).toStrictEqual(new Date('2020-2-2 2:00:00'));
  expect(b0ByBookId.return_time).toEqual(null);
  expect(await getRentRetHistoryByBookId(connection, 20)).toEqual(null);
  expect(await getRentRetHistoryByUserId(connection, 'notfound')).toEqual(null);
});
