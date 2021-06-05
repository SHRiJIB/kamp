const { campgroundSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError.js')
const Campground = require('../models/campground.js')

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((ob) => ob.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
  if (!camp.author.equals(req.user._id)) {
    req.flash('error', "You don't have permission to do that.🚫")
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}
