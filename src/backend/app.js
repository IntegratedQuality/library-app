const express = require('express');
const PORT = 3000;
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));

app.listen(PORT, async ()=>{
  const connection = await mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'rootpass',
    database: 'lib_db_test',
    charset: 'utf8'
  });
  console.log(`listen http://localhost:${PORT}`);
});
