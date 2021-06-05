const Campground = require('../models/campground.js')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first!!')
    return res.redirect('/auth/login')
  }
  next()
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
