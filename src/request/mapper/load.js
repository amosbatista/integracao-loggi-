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
            message: `Erro ao carregar a requisição ${requestId} do banco.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service