const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const dotenv = require('dotenv')
const cities = require('./cities.js')
const { descriptors, places } = require('./seedHelpers.js')
dotenv.config()
mongoose.connect(process.env.CONNECTION_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error!!'))
db.once('open', () => {
  console.log('MONGO IS ONNN!!!')
})

const titleGenerator = (array) => {
  const randInd = Math.floor(Math.random() * array.length)
  return array[randInd]
}

const seedDB = async () => {
  await Campground.deleteMany({})

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const randPrice = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      image: 'https://source.unsplash.com/random',
      title: `${titleGenerator(descriptors)} ${titleGenerator(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt veritatis corporis exercitationem aliquid id? Eaque veritatis necessitatibus accusantium ducimus, maiores illum odit itaque quibusdam consequatur sint velit nam sunt laboriosam.',
      price: randPrice,
    })
    await camp.save()
  }
}

seedDB().then(() => {
  db.close()
})
