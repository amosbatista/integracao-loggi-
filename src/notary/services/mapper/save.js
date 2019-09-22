import serviceModel from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.serviceConnection = dbConnection('service', serviceModel)
  }

  save(requestId, service) {

    return new Promise((resolve, reject)=> {
      let serviceConnection = this.serviceConnection
      
      serviceConnection.sync().then( () => {

        serviceConnection.create({
          requestId,
          serviceId: service.serviceId,
          amount: service.amount,
          value: service.value,
          totalValue: service.totalValue,
          text: service.text
        })
        .then(()=>{
          resolve()
        })
        .catch((err)=>{
          reject({
            message: `Erro ao salvar um novo serviço para a requisição ${requestid}`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service