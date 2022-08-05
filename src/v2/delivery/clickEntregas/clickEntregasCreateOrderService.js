import httpReq from 'superagent'
import notaryAddress from '../../notary/entity'

const DESCRICAO = "Documentos a serem retirados e levados para o 20º cartório.";
const PESO_TOTAL = "2";
const MUST_ENABLE_NOTIFICATION = true;

const service = (addressData, servicesData) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {
        "matter": "${DESCRICAO}",
        "total_weight_kg": ${PESO_TOTAL},
        "is_contact_person_notification_enabled": ${MUST_ENABLE_NOTIFICATION},
        "points": [
            {
                "note": "${addressData.addressComplement}",
                "address":"${addressData.completeAddress}",
                "contact_person":{
                    "name": "${servicesData.clientName}",
                    "phone":"${servicesData.clientPhone}"
                }
            },
            {
                "address": "${notaryAddress.completeAddress}",
                "contact_person":{
                    "name": "${notaryAddress.contactName}",
                    "phone":"${notaryAddress.contactPhone}"
                }
            }
        ]
    }
    `

    httpReq.post(`${process.env.CLICK_ENTREGAS_API}/create-order`)
    .send(query)
    .set('X-DV-Auth-Token', process.env.CLICK_ENTREGAS_TOKEN)
    .set('Content-Type', 'application/json')
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: 'Erro ao fazer requisição para criar entrega na API da Click Entregas',
          data: JSON.stringify(err)
        })

        return
      }

      if(apiRes.body.errors){
        reject({
          message: 'Erro interno da API Click Entregas ao criar entrega',
          data: JSON.stringify(apiRes.body.errors.text)
        })

        return
      }

      if(apiRes.body.warnings &&  apiRes.body.warnings.length > 0){
        reject({
          message: 'Está faltando informações para finalizar a entrega.',
          data: apiRes.body.parameter_warnings
        })

        return
      }
      
      resolve({
        "loggiOrderId": apiRes.body.order.order_id,
        "packageId": apiRes.body.order.points[0].point_id,
      })
      
    })
  })
}

export default service