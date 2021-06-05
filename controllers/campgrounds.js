const Campground = require('../models/campground.js')
const getAllCamps = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}
const getCampById = async (req, res) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author')
  if (!camp) {
    req.flash('error', 'Cannot find the campground.')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { camp })
}
const addNewCamp = async (req, res) => {
  const campground = new Campground(req.body.campground)
  campground.author = req.user._id
  await campground.save()
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

const editCampground = async (req, res) => {
  const { id } = req.params
  const camp = await Campground.findById(id)
  if (!camp) {
    req.flash('error', 'Cannot find the campground.')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { camp })
}
const updateCamp = async (req, res) => {
  const { id } = req.params
  const { campground } = req.body
  const camp = await Campground.findByIdAndUpdate(id, { ...campground })
  req.flash('success', 'Successfully updated the campground!')
  res.redirect(`/campgrounds/${camp._id}`)
}
const deleteCamp = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted review!')
  res.redirect('/campgrounds')
}

module.exports = {
  getAllCamps,
  addNewCamp,
  getCampById,
  editCampground,
  updateCamp,
  deleteCamp,
}
