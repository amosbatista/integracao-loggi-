import requestModel from '../../model'
import orderModel from '../model'
import dbConnection from '../../../database/helper'
import { isNull } from 'util';

const service = class {

  constructor () {
    this.orderConnection = dbConnection('requestOrder', orderModel(requestModel))
  }

  load(request) {

    return new Promise((resolve, reject)=> {
      let orderConnection = this.orderConnection
      
      orderConnection.sync().then( () => {

        orderConnection.loadAll({
          where: {
            id: request.id
          }
        })
        .then((order)=>{
          console.log('Order:', order)
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