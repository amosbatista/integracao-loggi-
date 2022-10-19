import model from '../../../../v1/delivery/db/model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.deliveryConnection = dbConnection('delivery', model)
  }

  update(deliveryId, status) {

    return new Promise((resolve, reject)=> {
      let deliveryConnection = this.deliveryConnection
      
      deliveryConnection.sync().then( () => {

        deliveryConnection.update(
          {
            deliveryStatus: status
          },
          {
            where: {
              deliveryId
            }
          }
        )
        .then(()=>{
          deliveryConnection.sequelize.close()
          resolve()
        })
        .catch((err)=>{
          deliveryConnection.sequelize.close()
          reject({
            message: `Erro ao atualizar delivery ${deliveryId} no banco de dados`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service