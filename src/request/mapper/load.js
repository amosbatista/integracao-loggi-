import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestModel = dbConnection('request', model)
  }

  load(requestId) {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.findOne({
          where: { 
            id: requestId
          }
        })
        .then((request)=>{
          resolve(request)
        })
        .catch((err)=>{
          reject({
            message: `Error at retrieve of request ${requestId} from database.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service