const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 函式庫
const utilities = {
  ConvertToSlashDate(dashDate) {
    return new Date(dashDate).toLocaleDateString('zh-TW')
  },
  ConvertToDashDate(slashDate) {
    // 1. 取出日期，並將年月日以字串格式分開存入陣列，並以padStart函數補0
    const date = new Date(slashDate)
    const dateArray = [date.getFullYear(), (date.getMonth() + 1).toString(10).padStart(2, '0'), (date.getDate()).toString(10).padStart(2, '0')]
    // 2. 重組成字串
    return dateArray.join('-')
  }
}

// GET路由：new
router.get('/new', (req, res) => {
  // 先找出Category的資料，結果存到categories
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
})

// POST路由：new
router.post('/', (req, res) => {
  const { name, date, categoryName, amount } = req.body
  const userId = req.user._id
  // 將日期從YYYY-MM-DD轉成YYYY/MM/DD
  let slashDate = utilities.ConvertToSlashDate(date)

  Category.findOne({ name: categoryName })
    .lean()
    .then(category => {
      let categoryId = category._id

      Record.create({
        name,
        date: slashDate,
        amount,
        userId,
        categoryId
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// GET路由：edit
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  Category.find()
    .lean()
    .then(categories => {
      Record.findOne({ _id, userId })
        .populate('categoryId')
        .lean()
        .then(record => {
          // 將日期從YYYY/MM/DD轉成YYYY-MM-DD 給HTML的value
          dashDate = utilities.ConvertToDashDate(record.date)

          categories.map((category, index) => {
            if (category.name === record.categoryId.name) {
              categories[index]['isChoosed'] = true
            }
          })
          res.render('edit', { categories, record, dashDate })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// PUT路由：edit
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, categoryName, amount } = req.body
  let slashDate = utilities.ConvertToSlashDate(date)//年/月/日

  Category.findOne({ name: categoryName })
    .then(category => {
      Record.findOne({ _id, userId })
        .then(record => {
          record.name = name
          record.date = slashDate
          record.amount = amount
          record.categoryId = category._id

          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// DELETE路由：delete
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router 