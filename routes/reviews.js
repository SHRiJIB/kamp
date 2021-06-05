const express = require('express')
const catchAsyncError = require('../utils/catchAsyncError.js')
const { addReview, deleteReview } = require('../controllers/reviews.js')
const { isLoggedIn } = require('../middleware/authMw.js')
const { validateReview } = require('../middleware/reviewMw.js')

const router = express.Router({ mergeParams: true })

// add reviews to a campground
router.post('/', isLoggedIn, validateReview, catchAsyncError(addReview))

//delete reviews
router.delete('/:reviewId', catchAsyncError(deleteReview))

module.exports = router
