import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.model = dbConnection('comics', model)
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
            message: `Erro ao carregar a obra ${id}.`,
            data: err
          })
        })
      })
    })
  }

  loadAllFromCreator(creatorId) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findAll({
          where: { 
            creatorId
          }
        })
        .then((comics)=>{
          model.sequelize.close()
          resolve(comics)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar as obras do criador ${userId}.`,
            data: err
          })
        })
      })
    })
  }

  loadAll() {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findAll()
        .then((comics)=>{
          model.sequelize.close()
          resolve(comics)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar todas as obras.`,
            data: err
          })
        })
      })
    })
  }
}

export default service