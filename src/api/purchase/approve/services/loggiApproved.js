import httpReq from 'superagent'

// {
//   inquiryId: 0
// }

const service = (addressData, servicesData, paymentData, auth) => {

  return new Promise ((resolve, reject) => {

    const notariusStoreId = process.env.LOGGI_STORE_ID
    const paymentMethodAlreadyChaged = 64

    const notariusAddress = {
      lat:  -23.5857434,
      lng: -46.6785174,
      completeAddress: 'R. Joaquim Floriano, 889 - Itaim Bibi, São Paulo - SP, 04534-011, Brazil',
      complement: ""
    }

    const query = `mutation {
      createOrder(input: {
        shopId: ${notariusStoreId}
        pickups: [{
          address: {
            lat: ${ addressData.coordinates.lat}
            lng: ${ addressData.coordinates.lng}
            address: "${addressData.completeAddress}"
            complement: "${addressData.addressComplement}"
          }
        }]
        packages: [{
          pickupIndex: 0
          recipient: {
            name: "${servicesData.clientName}"
            phone: "${servicesData.clientPhone}"
          }
          address: {
            lat: ${notariusAddress.lat}
            lng: ${notariusAddress.lng}
            address: "${notariusAddress.completeAddress}"
            complement: "${notariusAddress.complement}"
          }
          charge: {
            value: "${paymentData.deliveryTax}"
            method: ${paymentMethodAlreadyChaged}
            change: "0.00"
          }
          dimensions: {
            width: 10
            height: 10
            length: 10
          }
        }]
      }) {
        success
        shop {
          pk
          name
          order {
            pk
            packages {
              pk
              status
              pickupWaypoint {
                index
                indexDisplay
                eta
                legDistance
              }
              waypoint {
                index
                indexDisplay
                eta
                legDistance
              }
            }
          }
        }
        errors {
          field
          message
        }
      }
    }
    `

    console.log(query)
    
    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      "query": query
    })
    .set('Content-Type', "application/json")
    .set('authorization', auth)

    .end((err, apiRes) => {
      if(err){

        reject({
          message: "Error at Loggi's API order confirmation",
          data: err
        })
        return
      }
      
      if(!apiRes.body.data.createOrder.success) {

        reject({
          message: `The Loggi's order confirmation has response, but returned errors`,
          data: apiRes.body.data.createOrder.errors
        })
        return
      }

      resolve({
        "loggiOrderId": apiRes.body.data.createOrder.shop.order.pk
      })

    })
  })
}

export default service