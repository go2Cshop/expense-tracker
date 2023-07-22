const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')
const data = require('./data.json').data


const SEED_USER = data.SEED_USER
const SEED_RECORD = data.SEED_RECORD

db.once('open', () => {
  Promise.all(
    SEED_RECORD.map(item => {
      Category.findOne({ name: item.category_name })
        .then(category_attr => {
          item.category_id = category_attr._id
        })
    })
  )
    .then(
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: SEED_USER.password
      })
        .then(user => {
          SEED_RECORD.map(record => {
            Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              userId: user._id,
              categoryId: record.category_id
            })
          })
        })
    )
}) 