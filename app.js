const express = require('express');
const bodyParser = require('body-parser');
const { OpBase } = require('./router');
// 请求大小限制
const requestLimit = '5120kb';
const app = express();

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 处理根路由请求
app.get('/', (req, res) => {
  res.send('欢迎访问nodejs');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// 解析表单的中间件
app.use(express.urlencoded({ extended: false, limit: requestLimit }));
app.use(bodyParser.json({ limit: requestLimit }));
app.use('/DataSvr', OpBase);