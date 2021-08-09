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
          packageId: deliveryData.packageId,
          type: deliveryData.type || type.TO_RECEIVE
        })
        .then((newDelivery)=>{
          deliveryConnection.sequelize.close()
          resolve(newDelivery)
        })
        .catch((err)=>{
          deliveryConnection.sequelize.close()
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