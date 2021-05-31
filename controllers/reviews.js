const Campground = require('../models/campground.js')
const Review = require('../models/review.js')

const addReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash('success', 'Successfully added review!')
  res.redirect(`/campgrounds/${campground._id}`)
}

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', 'Successfully deleted review!')
  res.redirect(`/campgrounds/${id}`)
}

module.exports = { addReview, deleteReview }
