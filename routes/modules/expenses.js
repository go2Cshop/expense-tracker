const express = require('express')
const router = express.Router()

// 路由：new
router.get('/new', (req, res) => {
  res.render('new')
})

// 路由：edit
router.get('/edit', (req, res) => {
  res.render('edit')
})

module.exports = router 