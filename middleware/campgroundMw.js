const { campgroundSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError.js')

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((ob) => ob.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
