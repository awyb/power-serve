var express = require('express');
var router = express.Router();
//导入连接mysql的函数，用于后于的mysql操作
const coon = require('../db/index')
const successCode = 200
const failCode = 400

router.post('/query', (req, res) => {
  const params = req.body
  const [_tabname, _exp, _orderby] = [params.tabname, params.exp, params.orderby]
  const exp = _exp ? `where ${_exp}` : ''
  const order = _orderby ? `order by ${_orderby}` : ''
  coon.query(`select * from ${_tabname} ${exp} ${order}`, (err, data) => {
    if (err) res.send({ status: failCode, message: '请求失败', err })
    res.send({ status: successCode, message: '请求数据成功', data: data })
  })
})

router.post('/add', (req, res) => {
  const params = req.body
  const [_tabname, _data, _ret] = [params.tabname, params.data, params.ret]
  Object.keys(_data).forEach(function (key) {
    if (typeof _data[key] === 'object')
      _data[key] = JSON.stringify(_data[key])
  })
  coon.query(`insert into ${_tabname} set ?`, _data, async (err, data) => {
    if (err) res.send({ status: failCode, message: '插入失败', err })
    if (_ret === 1) {
      coon.query(`select * from ${_tabname} where id = ${data.insertId}`, (err, data) => {
        res.send({ status: successCode, message: '插入成功', data: data })
      })
    }
    else
      res.send({ status: successCode, message: '插入成功' })
  })
})

router.post('/delete', (req, res) => {
  const params = req.body
  const [_tabname, _ids, _ret] = [params.tabname, params.ids, params.ret]
  coon.query(`delete from ${_tabname} where id in (${_ids})`, async (err, data) => {
    if (err) res.send({ status: failCode, message: '删除失败', err })
    if (_ret === 1) {
      coon.query(`select * from ${_tabname} where id = in (${_ids})`, (err, data) => {
        res.send({ status: successCode, message: '删除成功', data: data })
      })
    }
    else
      res.send({ status: successCode, message: '删除成功' })
  })
})

router.post('/update', (req, res) => {
  const params = req.body
  const [_tabname, _data, _id, _nval, _ret] = [params.tabname, params.data, params.id, params.nval, params.ret]
  const _updExp = Object.entries(_nval).map(([key, value]) => `${key} = ?`).join(', ');
  const _values = [...Object.values(_nval)]
  coon.query(`update ${_tabname} set ${_updExp} where id = ${_id}`, _values, async (err, data) => {
    if (err) res.send({ status: failCode, message: '更新失败', err })
    if (_ret === 1) {
      coon.query(`select * from ${_tabname} where id = ${_id}`, (err, data) => {
        res.send({ status: successCode, message: '更新成功', data: data })
      })
    }
    else
      res.send({ status: successCode, message: '插入成功' })
  })
})

module.exports = router;