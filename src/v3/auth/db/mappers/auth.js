import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.model = dbConnection('users', model)
  }

  auth(email, pwd) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findAll({
          where: { 
            email, pwd
          }
        })
        .then((user)=>{
          model.sequelize.close()
          resolve(user)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao autenticar.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service