const MongoDBStore = require('connect-mongo')
const {
  connectSrcUrls,
  fontSrcUrls,
  scriptSrcUrls,
  styleSrcUrls,
  imageSrcUrls,
} = require('./allowedSources')

const mongoose = require('mongoose')

module.exports.connectDB = (url) => {
  mongoose
    .connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('DB CONNECTED!!')
    })
    .catch((err) => console.log(err))
}

module.exports.showPortNumber = (port) => () => {
  console.log(`SERVER IS RUNNIG ON PORT ${port}`)
}

module.exports.consoleStoreError = (e) => {
  console.log(e)
}

module.exports.getSessionConfig = (secret) => ({
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
})

module.exports.createMongoDBStore = (mongoUrl, secret) =>
  new MongoDBStore({
    mongoUrl,
    secret,
    touchAfter: 24 * 60 * 60,
  })

module.exports.getContentSecurityPolicyOptions = () => ({
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
