const mongoose = require('mongoose')
const Review = require('./review.js')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  url: String,
  filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_100')
})

const opts = { toJSON: { virtuals: true } }
const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
)

CampgroundSchema.virtual('properties.popup').get(function () {
  return `
  <h4>${this.title}</h4>
  <a role="button" class="btn btn-outline-dark" href="/campgrounds/${this._id}">View</a>
  `
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
