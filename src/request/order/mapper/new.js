import orderModel from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.orderConnection = dbConnection('requestOrder', orderModel)
  }

  save(order, request) {

    return new Promise((resolve, reject)=> {
      let orderConnection = this.orderConnection
      
      orderConnection.sync().then( () => {

        orderConnection.create({
          proposedValue: order.proposedValue,
          realValue: order.realValue,
          realServiceValue: order.realServiceValue,
          isRealValueDifferentFromProposed: order.isRealValueDifferentFromProposed,
          reasonToDifference: order.reasonToDifference,
          requestId: request.id
        })
        .then(()=>{
          resolve()
        })
        .catch((err)=>{
          reject({
            message: 'Erro ao criar nova compra de pedido no banco de dados',
            data: err
          })
        })
      })
    })
    
  }
}

export default service