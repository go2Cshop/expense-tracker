const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const expenses = require('./modules/expenses')
const user = require('./modules/user')

router.use('/expenses', expenses)
router.use('/', home)
router.use('/users', user)

module.exports = router 