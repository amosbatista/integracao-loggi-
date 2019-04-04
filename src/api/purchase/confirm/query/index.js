import addressComponents from './addressComponents'

const query = (originData, notaryData) => {
  const formatedQuery = `
  mutation {
    createOrderInquiry(input: {
      city: 1
      packageType: "document"
      slo: 1
      clientMutationId: "test_inquiry"
      waypoints: [
        {
          addressComplement: "Complemento retirada"
          instructions: "Retirada de documento"
          tag: , retirar_documento
          addressData: ${addressComponents(originData)}
        }, 
        {
          addressComplement: "Complemento da entrega"
          instructions: "Entregar documento"
          tag: entregar
          addressData: ${addressComponents(notaryData)}
        }]
    }) {
      success
      inquiry {
        pk
        pricing {
          totalCmGross
          bonuses
          totalCm
          appliedBonuses {
            discount
            key
            usercode
          }
        }
        numWaypoints
        productDescription
        paymentMethod {
          name
        }
      }
      errors {
        field
        message
      }
    }
  }`
  return formatedQuery.replace(/(\r\n|\n|\r)/gm, "")
  }
export default query