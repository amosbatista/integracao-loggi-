import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.serviceModel = dbConnection('service', model)
  }

  loadAll(requestId) {

    return new Promise((resolve, reject)=> {
      let serviceModel = this.serviceModel
      
      serviceModel.sync().then( () => {

        serviceModel.findAll({
          where: {
            requestId
          }
        })
        .then((services)=>{
          resolve(services)
        })
        .catch((err)=>{
          reject({
            message: `Erro ao pesquisar todos os serviços da requisição ${requestId}.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service