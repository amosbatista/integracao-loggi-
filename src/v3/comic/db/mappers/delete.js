import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.dbConnection = dbConnection('comics', model)
  }

  delete(comicId) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync({ alter: process.env.MUST_UPDATE_DATABASE_MODEL }).then( () => {

        connection.destroy({
          where: {
            id: comicId
          }
        })
        .then((newPage)=>{
          connection.sequelize.close()
          resolve(newPage)
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao apagar a obra ${comicId}`,
            data: err
          })
        })
      })
    }) 
  }
}

export default service