const express = require('express')
const { reviewSchema } = require('../schemas.js')
const catchAsyncError = require('../utils/catchAsyncError.js')
const ExpressError = require('../utils/ExpressError.js')
const { addReview, deleteReview } = require('../controllers/reviews.js')

const router = express.Router({ mergeParams: true })
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((ob) => ob.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

// add reviews to a campground
router.post('/', validateReview, catchAsyncError(addReview))

//delete reviews
router.delete('/:reviewId', catchAsyncError(deleteReview))

module.exports = router
