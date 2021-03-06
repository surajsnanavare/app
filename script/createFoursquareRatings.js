const {Review} = require('../server/db/models')
const axios = require('axios')
const {foursquareClientId, foursquareApiKey} = require('../secrets')

const fs = require('fs')

const iconUrl = 'https://image.flaticon.com/icons/svg/174/174850.svg'

async function foursquareCreate(restaurantObj) {
  try {
    console.log('Creating Foursquare reviews...')
    const fsqData = JSON.parse(
      fs.readFileSync('script/finalFoursquareData.json', 'utf8')
    )

    const bulkCreateArr = fsqData
      .filter(restaurant => {
        if (restaurantObj[restaurant.name]) {
          return true
        }
      })
      .map(restaurant => {
        return {
          source: 'Foursquare',
          rating: restaurant.rating,
          restaurantId: restaurantObj[restaurant.name].id,
          sourceLogo: iconUrl,
          reviewUrl: restaurant.reviewUrl
        }
      })
    await Review.bulkCreate(bulkCreateArr)
    console.log('Foursquare is done!')
  } catch (error) {
    console.error(error)
  }
}

module.exports = foursquareCreate

// async function get4sq(offset) {
//   try {
//     const {data} = await axios.get(
//       `https://api.foursquare.com/v2/venues/explore?section=food&offset=${offset}&near=New York, NY&client_id=${foursquareClientId}&client_secret=${foursquareApiKey}&v=20180814`
//     )
//     return data.response.groups[0].items.map(item => {
//       const venue = item.venue
//       return {
//         id: venue.id,
//         name: venue.name
//       }
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function get4sqIds() {
//   try {
//     let finalArr = []
//     for (let i = 0; i <= 240; i += 30) {
//       let tempArr = await get4sq(i)
//       finalArr = finalArr.concat(tempArr)
//     }
//     fs.writeFile('script/foursquareData.json', JSON.stringify(finalArr))
//     console.log('Done!')
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function get4sqRatings() {
//   try {
//     const idArr = JSON.parse(
//       fs.readFileSync('script/foursquareData.json', 'utf-8')
//     )
//     let finalArr = []
//     for (let i = 0; i < idArr.length; i++) {
//       const {data} = await axios.get(
//         `https://api.foursquare.com/v2/venues/${
//           idArr[i].id
//         }?client_id=${foursquareClientId}&client_secret=${foursquareApiKey}&v=20180814`
//       )
//       let venue = data.response.venue
//       finalArr.push({
//         name: venue.name,
//         rating: venue.rating,
//         reviewUrl: venue.canonicalUrl
//       })
//     }
//     fs.writeFile('script/finalFoursquareData.json', JSON.stringify(finalArr))
//     console.log('done!')
//   } catch (error) {
//     console.error(error)
//   }
// }
