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
          deliveryModel.sequelize.close()
          resolve(delivery)
        })
        .catch((err)=>{
          deliveryModel.sequelize.close()
          reject({
            message: `Erro ao carregar os dados da transportadora do pedido ${requestId}.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service