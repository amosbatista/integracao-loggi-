import orderModel from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.orderConnection = dbConnection('requestOrder', orderModel)
  }

  load(request) {

    return new Promise((resolve, reject)=> {
      let orderConnection = this.orderConnection
      
      orderConnection.sync().then( () => {

        orderConnection.findOne({
          where: {
            id: request.id
          }
        })
        .then((order)=>{
          resolve(order)
        })
        .catch((err)=>{
          reject({
            message: 'Erro ao carregar compra na base de dados.',
            data: err
          })
        })
      })
    })
    
  }
}

export default service