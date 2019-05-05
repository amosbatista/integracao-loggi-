import requestModel from '../../model'
import logModel from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.transaction = dbConnection('requestLog', logModel(requestModel))
  }

  save(requestId, lastStatus, newStatus) {

    return new Promise((resolve, reject)=> {
      let transaction = this.transaction
      
      transaction.sync().then( () => {

        transaction.create({
          lastStatus,
          newStatus,
          requestId
        })
        .then(()=>{
          resolve()
        })
        .catch((err)=>{
          reject({
            message: 'Error at create new request log into database',
            data: err
          })
        })
      })
    })
    
  }
}

export default service