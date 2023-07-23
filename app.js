// 載入 express 並建構應用程式伺服器
const express = require('express')
const exphbs = require('express-handlebars')
// Method-Override: RESTful API相關
const methodOverride = require('method-override')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const routes = require('./routes')
const passport = require('passport')

const app = express()
const PORT = process.env.PORT

// Handlebars設定
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body-parser
app.use(express.urlencoded({ extended: true }))

// Method-override設定
app.use(methodOverride('_method'))

// Express-session設定
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
}) 