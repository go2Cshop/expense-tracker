if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')

const SEED_USER = {
  name: '廣志',
  email: 'user1@gmail.com',
  password: '1234'
}

const SEED_RECORD = [
  {
    name: '午餐',
    date: '2019/4/23',
    amount: '60',
    category_name: '餐飲食品'
  },
  {
    name: '晚餐',
    date: '2019/4/23',
    amount: '60',
    category_name: '餐飲食品'
  },
  {
    name: '捷運',
    date: '2019/4/23',
    amount: '120',
    category_name: '交通出行'
  },
  {
    name: '電影:驚奇隊長',
    date: '2019/4/23',
    amount: '60',
    category_name: '休閒娛樂'
  },
  {
    name: '租金',
    date: '2019/4/1',
    amount: '25000',
    category_name: '家居物業'
  }
]

db.once('open', () => {
  // 先從Category配測試資料的category_id
  SEED_RECORD.map((item, index) => {
    return Category.findOne({ name: item.category_name })
      .then(categoryAttr => {
        SEED_RECORD[index].category_id = categoryAttr._id
        return categoryAttr
      })
  })

  // 再新增測試帳號到User
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    })
      // 將配好category_id和userId的資料新增到Record
      .then(user => {
        Promise.all(
          SEED_RECORD.map(record => {
            return Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              userId: user._id,
              categoryId: record.category_id
            })
          })
        )
          .then(() => {
            console.log('RecordSeeder is executed.')
            process.exit()
          })
      })
    )
})
