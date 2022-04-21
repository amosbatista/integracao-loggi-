import serviceModel from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.serviceConnection = dbConnection('card', serviceModel)
  }

  save(userId, cardHash, cardNumber, cardBrand) {

    return new Promise((resolve, reject)=> {
      let serviceConnection = this.serviceConnection
      
      serviceConnection.sync().then( () => {

        serviceConnection.create({
          userId, 
          cardHash,
          cardNumber,
          cardBrand
        })
        .then(()=>{
          serviceConnection.sequelize.close()
          resolve()
        })
        .catch((err)=>{
          serviceConnection.sequelize.close()
          reject({
            message: `Erro ao salvar um cartão para o usuário ${userId}`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service