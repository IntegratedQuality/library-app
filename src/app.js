const express = require('express');
const PORT = 3000;


const app = express();
// JSON
app.use(express.json());

// API
const apirouter = require('./v1/api');
app.use('/api/v1/', apirouter);
// 静的ファイル
app.use(express.static('frontend/public'));

app.listen(PORT,()=>{
  console.log(`listen http://localhost:${PORT}`);
});

module.exports = app;
