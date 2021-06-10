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
const multer = require('multer')
const { CloudStorage } = require('../cloudinary/index.js')
const upload = multer({ storage: CloudStorage })
const {
  validateCampground,
  isAuthor,
} = require('../middleware/campgroundMw.js')

const catchAsync = require('../utils/catchAsyncError.js')
const { isLoggedIn } = require('../middleware/authMw.js')

//all campgrounds route
router.get('/', catchAsync(getAllCamps))

//new campground page route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})
// get campground by id
router.get('/:id', catchAsync(getCampById))

//add new campground
router.post(
  '/',
  isLoggedIn,
  upload.array('image'),
  validateCampground,
  catchAsync(addNewCamp)
)

//edit page route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCampground))

//update campground
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  upload.array('image'),
  validateCampground,
  catchAsync(updateCamp)
)

//delete campground from database
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCamp))

module.exports = router
