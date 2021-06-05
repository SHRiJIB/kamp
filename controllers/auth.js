const User = require('../models/user.js')
const passport = require('passport')

const registerNewUser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
      if (err) {
        next(err)
      }

      req.flash('success', 'Welcome to YelpCamp!!!')
      res.redirect('/campgrounds')
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/auth/register')
  }
}

const login = (req, res) => {
  req.flash('success', `Welcome back!! ${req.body.username}`)
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo
  res.redirect(redirectUrl)
}

const logout = (req, res) => {
  req.logout()
  res.locals.currentUser = null
  req.flash('success', 'Good Bye 👋👋')
  res.redirect('/campgrounds')
}

const authenticateUser = passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/auth/login',
})
module.exports = { registerNewUser, login, logout, authenticateUser }
