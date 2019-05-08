import orderModel from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.orderConnection = dbConnection('requestOrder', orderModel)
  }

  load(requestId) {

    return new Promise((resolve, reject)=> {
      let orderConnection = this.orderConnection
      
      orderConnection.sync().then( () => {

        orderConnection.findOne({
          where: {
            requestId: requestId
          }
        })
        .then((order)=>{

          // Forcing conversion values to decimal (due MYSQL2 preciosion bug)
          order.proposedValue = Number.parseFloat(order.proposedValue)
          order.realValue = Number.parseFloat(order.realValue)
          order.realServiceValue = Number.parseFloat(order.realServiceValue)

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