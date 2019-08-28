import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.deliveryModel = dbConnection('delivery', model)
  }

  load(requestId) {

    return new Promise((resolve, reject)=> {
      let deliveryModel = this.deliveryModel
      
      deliveryModel.sync().then( () => {

        deliveryModel.findAll({
          where: { 
            requestId
          }
        })
        .then((delivery)=>{
          resolve(delivery)
        })
        .catch((err)=>{
          reject({
            message: `Erro ao carregar os dados da transportadora do pedido ${delivery.requestId}.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service