// 載入 express 並建構應用程式伺服器
const express = require('express')
const exphbs = require('express-handlebars')
// Method-Override: RESTful API相關
const methodOverride = require('method-override')
const session = require('express-session')
// Connect flash
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const routes = require('./routes')
const usePassport = require('./config/passport')

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

// 呼叫usePassport
usePassport(app)

// Connect flash設定
app.use(flash())

// Middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
