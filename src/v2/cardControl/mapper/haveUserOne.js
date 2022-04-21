import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestModel = dbConnection('card', model)
  }

  load(userId) {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.findOne({
          where: { 
            userId
          }
        })
        .then((card)=>{
          requestModel.sequelize.close()
          resolve(card ? true : false)
        })
        .catch((err)=>{
          requestModel.sequelize.close()
          reject({
            message: `Erro ao checar se o usuário ${userId} tem cartão ou não.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service