import model from '../model'
import dbConnection from '../../../database/helper'
import types from '../types'

const service = class {

  constructor () {
    this.usersConnection = dbConnection('users', model)
  }

  save(userData) {

    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.create({
          name: userData.name,
          email: userData.email,
          pwd: userData.pwd,
          userType: userData.userType || types.COMMON,
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao salvar o usuário.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service