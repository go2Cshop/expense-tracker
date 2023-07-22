
const Record = require('../record')
const User = require('../user')
const Category = require('../category')

const db = require('../../config/mongoose')

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

const SEED_RECORD = [

  {
    "name": "午餐",
    "date": "2019/4/23",
    "amount": "60",
    "category_name": "餐飲食品"
  },
  {
    "name": "晚餐",
    "date": "2019/4/23",
    "amount": "60",
    "category_name": "餐飲食品"
  },
  {
    "name": "捷運",
    "date": "2019/4/23",
    "amount": "120",
    "category_name": "交通出行"
  },
  {
    "name": "電影:驚奇隊長",
    "date": "2019/4/23",
    "amount": "60",
    "category_name": "休閒娛樂"
  },
  {
    "name": "租金",
    "date": "2019/4/1",
    "amount": "25000",
    "category_name": "家居物業"
  }
]

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