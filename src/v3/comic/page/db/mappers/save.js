import model from '../model'
import dbConnection from '../../../../database/helper'

const service = class {

  constructor () {
    this.dbConnection = dbConnection('pages', model)
  }

  saveNew(page) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {

        connection.create(page)
        .then((newPage)=>{
          connection.sequelize.close()
          resolve(newPage)
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao salvar a página.`,
            data: err
          })
        })
      })
    }) 
  }

}

export default service