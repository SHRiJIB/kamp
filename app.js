require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const app = express()
const campgroundRouter = require('./routes/campgrounds.js')
const reviewRouter = require('./routes/reviews.js')
const authRouter = require('./routes/auth.js')
const homeRouter = require('./routes/home.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const PORT = process.env.PORT || 3000
const { showFlashMessage } = require('./middleware/flashMw.js')
const { catchExpressErrors, catchErrors } = require('./middleware/errorMw.js')
const {
  showPortNumber,
  consoleStoreError,
  getSessionConfig,
  createMongoDBStore,
  getContentSecurityPolicyOptions,
  connectDB,
} = require('./utils/utils.js')

connectDB(process.env.CONNECTION_URL)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(methodOverride('_method'))

//helmet
app.use(helmet())
app.use(helmet.contentSecurityPolicy(getContentSecurityPolicyOptions()))

//ejs set up
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//to serve static files in public folder
app.use(express.static(path.join(__dirname, 'public')))

//session store
const store = createMongoDBStore(process.env.CONNECTION_URL, process.env.SECRET)

store.on('error', consoleStoreError)
//session config
const sessionConfig = getSessionConfig(process.env.SECRET, store)

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
app.use(showFlashMessage)

//routing
app.use('/', homeRouter)
app.use('/auth', authRouter)
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)

app.all('*', catchExpressErrors)

app.use(catchErrors)

app.listen(PORT, showPortNumber(PORT))
