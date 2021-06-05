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
const { validateCampground } = require('../middleware/campgroundMw.js')

const catchAsync = require('../utils/catchAsyncError.js')
const { isAuthor, isLoggedIn } = require('../middleware/authMw.js')

//all campgrounds route
router.get('/', catchAsync(getAllCamps))

//new campground page route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})
// get campground by id
router.get('/:id', catchAsync(getCampById))

//add new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(addNewCamp))

//edit page route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCampground))

//update campground
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(updateCamp)
)

//delete campground from database
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCamp))

module.exports = router
