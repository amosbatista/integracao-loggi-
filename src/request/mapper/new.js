import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestConnection = dbConnection('request', model)
  }

  save(requestData) {
    return new Promise((resolve, reject)=> {
      let requestConnection = this.requestConnection
      
      requestConnection.sync().then( () => {

        requestConnection.create({
          clientName: requestData.clientName,
          clientEmail: requestData.clientEmail,
          clientPhone: requestData.clientPhone,
          completeAddress: requestData.completeAddress,
          addressComplement: requestData.addressComplement,
          totalPurchase: requestData.totalPurchase,
          servicesSum: requestData.servicesSum,
          deliveryTax: requestData.deliveryTax,
          requestOperationTax: requestData.requestOperationTax,
          status: requestData.status
        })
        .then((newRequest)=>{
          resolve(newRequest)
        })
        .catch((err)=>{
          reject({
            message: 'Erro ao criar novo pedido no banco de dados',
            data: err
          })
        })
      })
    })
    
  }
}

export default service