import model from '../model'
import dbConnection from '../../../database/helper'
import type from "../deliveryType"

const service = class {

  constructor () {
    this.deliveryConnection = dbConnection('delivery', model)
  }

  save(deliveryData) {

    return new Promise((resolve, reject)=> {
      let deliveryConnection = this.deliveryConnection
      
      deliveryConnection.sync().then( () => {

        deliveryConnection.create({
          requestId: deliveryData.requestId,
          deliveryId: deliveryData.deliveryId,
          type: deliveryData.requestId || type.TO_RECEIVE
        })
        .then((newDelivery)=>{
          resolve(newDelivery)
        })
        .catch((err)=>{
          reject({
            message: `Erro ao salvar os dados da transportadora para o pedido ${deliveryData.requestId}.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service