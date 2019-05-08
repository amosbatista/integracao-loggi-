import logModel from './model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.transaction = dbConnection('requestLog', logModel)
  }

  save(request, newStatus) {

    return new Promise((resolve, reject)=> {
      let transaction = this.transaction
      
      transaction.sync().then( () => {

        transaction.create({
          lastStatus: request.status,
          newStatus,
          requestId: request.id
        })
        .then(()=>{
          resolve()
        })
        .catch((err)=>{
          reject({
            message: 'Erro ao criar novo log de pedido no banco de dados',
            data: err
          })
        })
      })
    })
    
  }
}

export default service