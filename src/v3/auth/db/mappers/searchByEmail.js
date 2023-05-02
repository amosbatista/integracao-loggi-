import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.model = dbConnection('users', model)
  }

  thisEmailExists(email) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.count({
          where: { 
            email
          }
        })
        .then((count)=>{
          model.sequelize.close()
          resolve(count > 0)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar os dados do usuário de email ${email}.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service