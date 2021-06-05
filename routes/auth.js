const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsyncError.js')

const {
  registerNewUser,
  login,
  logout,
  authenticateUser,
} = require('../controllers/auth.js')

router.get('/register', (req, res) => {
  res.render('auth/register')
})

router.post('/register', catchAsync(registerNewUser))

router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', authenticateUser, login)

router.get('/logout', logout)

module.exports = router
