const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground.js')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost:27017/Scamp', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error!!'))
db.once('open', () => {
  console.log('MONGO IS ONNN!!!')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
})
app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
  res.render('campgrounds/show', { camp })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
  res.render('campgrounds/edit', { camp })
})

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const { campground } = req.body
  const camp = await Campground.findByIdAndUpdate(id, { ...campground })
  res.redirect(`/campgrounds/${camp._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
})

app.listen(3000, () => {
  console.log('SERVER IS RUNNIG ON PORT 3000')
})
