const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const app = express()
const Campground = require('./models/campground.js')
const catchAsync = require('./utils/catchAsyncError.js')
const ExpressError = require('./utils/ExpressError.js')
const { campgroundSchema } = require('./schemas.js')

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
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const validateSchema = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((ob) => ob.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
//home page route
app.get('/', (req, res) => {
  res.render('home')
})

//all campgrounds route
app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  })
)

//add new campground  page route
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

//add new campground
app.post(
  '/campgrounds',
  validateSchema,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

// get campground by id
app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/show', { camp })
  })
)

//edit existing campgrounds
app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', { camp })
  })
)

//update campground
app.put(
  '/campgrounds/:id',
  validateSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const { campground } = req.body
    const camp = await Campground.findByIdAndUpdate(id, { ...campground })
    res.redirect(`/campgrounds/${camp._id}`)
  })
)

//delete campground from database
app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
  })
)

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) {
    err.message = 'Something Went Wrong'
  }
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('SERVER IS RUNNIG ON PORT 3000')
})
