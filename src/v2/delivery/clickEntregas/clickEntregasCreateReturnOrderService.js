import httpReq from 'superagent'
import notaryAddress from '../../notary/entity'
import phoneFormatHelper from './phoneFormatHelper';

const DESCRICAO = "Documentos que devem ser retirados do 20º cartório e devolvidos para o cliente.";
const PESO_TOTAL = "2";
const MUST_ENABLE_NOTIFICATION = true;

const service = (addressData, servicesData, requestId) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {
        "matter": "${DESCRICAO}",
        "total_weight_kg": ${PESO_TOTAL},
        "is_contact_person_notification_enabled": ${MUST_ENABLE_NOTIFICATION},
        "points": [
            {
                "note": "Procurar por Izabel. Informar código de retirada ${requestId}",
                "address": "${notaryAddress.completeAddress}",
                "contact_person":{
                    "name": "${notaryAddress.contactName}",
                    "phone":"${notaryAddress.contactPhone}"
                }
            },
            {
                "note": "${addressData.addressComplement}",
                "address":"${addressData.completeAddress}",
                "contact_person":{
                    "name": "${servicesData.clientName}",
                    "phone":"${phoneFormatHelper(servicesData.clientPhone)}"
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
          message: 'Erro ao fazer requisição para criar devolução na API da Click Entregas',
          data: JSON.stringify(err)
        })

        return
      }

      if(apiRes.body.errors){
        reject({
          message: 'Erro interno da API Click Entregas ao criar devolução',
          data: JSON.stringify(apiRes.body.errors)
        })

        return
      }

      if(apiRes.body.warnings &&  apiRes.body.warnings.length > 0){
        reject({
          message: 'Está faltando informações para finalizar a devolução.',
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