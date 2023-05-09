import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.dbConnection = dbConnection('creators', model)
  }

  saveNew(creatorData) {

    return new Promise((resolve, reject)=> {
      let usersConnection = this.dbConnection
      
      usersConnection.sync().then( () => {

        usersConnection.create(creatorData)
        .then((newCreator)=>{
          usersConnection.sequelize.close()
          resolve(newCreator)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao salvar o criador.`,
            data: err
          })
        })
      })
    })
    
  }

  update(creator) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.dbConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update(creator, {
          returning: true, 
          where: {
            id: creator.id
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao atualizar os dados do criador.`,
            data: err
          })
        })
      })
    })
  }

  disable(userId) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.dbConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          enabled: false
        }, {
          returning: true, 
          where: {
            userId
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao desabilitar criador.`,
            data: err
          })
        })
      })
    })
  }
}

export default service