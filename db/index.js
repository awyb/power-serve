// db/index.js
// 导入 mysql 模块
const mysql = require('mysql')

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '12345678',
  database: 'power',
  multipleStatements: true // 支持执行多条 sql 语句
})
db.connect(() => {
  console.log('connected to mysql server')
})
// 向外共享 db 数据库连接对象
module.exports = db