const { reviewSchema } = require('../schemas.js')
const Review = require('../models/review.js')
const ExpressError = require('../utils/ExpressError.js')
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((ob) => ob.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', "You don't have permission to do that.🚫")
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}
