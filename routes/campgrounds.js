const {
  getAllCamps,
  getCampById,
  editCampground,
  addNewCamp,
  deleteCamp,
  updateCamp,
} = require('../controllers/campgrounds.js')
const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsyncError.js')
const ExpressError = require('../utils/ExpressError.js')
const { campgroundSchema } = require('../schemas.js')

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((ob) => ob.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

//all campgrounds route
router.get('/', catchAsync(getAllCamps))

//new campground page route
router.get('/new', (req, res) => {
  res.render('campgrounds/new')
})
// get campground by id
router.get('/:id', catchAsync(getCampById))

//add new campground
router.post('/', validateCampground, catchAsync(addNewCamp))

//edit page route
router.get('/:id/edit', catchAsync(editCampground))

//update campground
router.put('/:id', validateCampground, catchAsync(updateCamp))

//delete campground from database
router.delete('/:id', catchAsync(deleteCamp))

module.exports = router
