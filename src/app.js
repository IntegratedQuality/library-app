const express = require('express');
const PORT = process.env.PORT || 3000;


const app = express();
// JSON
app.use(express.json());

// 静的ファイル
app.use(express.static('public'));

// auth
require('./auth')(app);

// API
const apirouter = require('./v1/api');
app.use('/api/v1/', apirouter);

app.listen(PORT,()=>{
  console.log(`listen http://localhost:${PORT}`);
});

module.exports = app;
