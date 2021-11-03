require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const app = express()
const ExpressError = require('./utils/ExpressError.js')
const campgroundRouter = require('./routes/campgrounds.js')
const reviewRouter = require('./routes/reviews.js')
const authRouter = require('./routes/auth.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoDBStore = require('connect-mongo')
const PORT = process.env.PORT || 3000
const {
  connectSrcUrls,
  fontSrcUrls,
  scriptSrcUrls,
  styleSrcUrls,
  imageSrcUrls,
} = require('./allowedSources')

mongoose.connect(process.env.CONNECTION_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error!!'))
db.once('open', () => {
  console.log('MONGO IS ONNN!!!')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(methodOverride('_method'))

//helmet
app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ['blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', ...imageSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
)

//ejs set up
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//to serve static files in public folder
app.use(express.static(path.join(__dirname, 'public')))

//session store
const store = new MongoDBStore({
  mongoUrl: process.env.CONNECTION_URL,
  secret: process.env.SECRET,
  touchAfter: 24 * 60 * 60,
})

store.on('error', function (e) {
  console.log(e)
})
//session config
const sessionConfig = {
  store,
  name: 'session',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}

app.use(session(sessionConfig))

//flash
app.use(flash())

//passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//flash middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

//routes
//home page route
app.get('/', (req, res) => {
  res.render('home')
})

//router
app.use('/auth', authRouter)
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)

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

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNIG ON PORT ${PORT}`)
})
