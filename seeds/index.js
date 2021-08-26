const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const dotenv = require('dotenv')
const cities = require('./cities.js')
const { descriptors, places } = require('./seedHelpers.js')
const multer = require('multer')
const { CloudStorage } = require('../cloudinary/index.js')
const upload = multer({ storage: CloudStorage })

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

const mbxToken = process.env.MAPBOX

//60b771403c217b4a08a84ebf
const seedDB = async () => {
  await Campground.deleteMany({})

  for (let i = 0; i < 100; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const randPrice = Math.floor(Math.random() * 20) + 10

    const camp = new Campground({
      author: '60b771403c217b4a08a84ebf',
      location: `${cities[random1000].city},${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/duyd9br4i/image/upload/v1622999889/Scamp/rzwuaendahyn6n9rmzjz.jpg',
          filename: 'Scamp/tezcovrltrwxtqpd5hs8',
        },
        {
          url: 'https://res.cloudinary.com/duyd9br4i/image/upload/v1623000876/Scamp/iwppuhwhv5wc54hfz14n.jpg',
          filename: 'Scamp/rzwuaendahyn6n9rmzjz',
        },
      ],
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
