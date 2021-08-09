import orderModel from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.orderConnection = dbConnection('requestOrder', orderModel)
  }

  save(order) {

    return new Promise((resolve, reject)=> {
      let orderConnection = this.orderConnection
      
      orderConnection.sync().then( () => {

        orderConnection.update(
          {
            isOrderComplete: true
          },
          {
          where: {
            id: order.id
          }
        })
        .then((order)=>{
          resolve(order)
        })
        .catch((err)=>{
          reject({
            message: 'Erro ao marcar a compra como finalizada.',
            data: err
          })
        })
      })
    })
    
  }
}

export default service