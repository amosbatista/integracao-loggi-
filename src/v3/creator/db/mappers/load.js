import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.model = dbConnection('creators', model)
  }

  load(id) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findOne({
          where: { 
            id
          }
        })
        .then((user)=>{
          model.sequelize.close()
          resolve(user)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar o criador ${id}.`,
            data: err
          })
        })
      })
    })
  }

  loadByUserId(userId) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findOne({
          where: { 
            userId
          }
        })
        .then((user)=>{
          model.sequelize.close()
          resolve(user.dataValues)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar o criador de userId ${userId}.`,
            data: err
          })
        })
      })
    })
  }
}

export default service