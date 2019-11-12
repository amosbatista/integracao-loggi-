import httpReq from 'superagent'

// {
//   inquiryId: 0
// }

const service = (addressData, servicesData, paymentData, auth, requestId) => {

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
            lat: ${notariusAddress.lat}
            lng: ${notariusAddress.lng}
            address: "${notariusAddress.completeAddress}"
            complement: "${notariusAddress.complement}"
          }
        }]
        packages: [{
          pickupIndex: 0
          recipient: {
            name: "Pedido número: ${requestId}. Avisar retirada de documento no balcão."
            phone: "${servicesData.clientPhone}"
          }
          address: {
            lat: ${ addressData.coordinates.lat}
            lng: ${ addressData.coordinates.lng}
            address: "${addressData.completeAddress}"
            complement: "${addressData.addressComplement}"
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
        }
        orders {
          pk
          trackingKey
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
        errors {
          field
          message
        }
      }
    }
    `
    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      "query": query
    })
    .set('Content-Type', "application/json")
    .set('authorization', auth)

    .end((err, apiRes) => {
      if(err){

        reject({
          message: "Erro ao confirmar pedido na API da Loggi",
          data: err
        })
        return
      }
      
      if(!apiRes.body.data.createOrder.success) {

        reject({
          message: `A confirmação de pedido foi feita, mas existem erros.`,
          data: apiRes.body.data.createOrder.errors
        })
        return
      }

      resolve({
        "loggiOrderId": apiRes.body.data.createOrder.orders[0].pk,
        "packageId": apiRes.body.data.createOrder.orders[0].packages[0].pk
      })

    })
  })
}

export default service