const ExpressError = require('../utils/ExpressError')

module.exports.catchErrors = (err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) {
    err.message = 'Something Went Wrong'
  }

  res.status(statusCode).render('error', { err })
}

module.exports.catchExpressErrors = (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
}
