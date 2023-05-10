import model from '../model'
import dbConnection from '../../../../database/helper'

const service = class {

  constructor () {
    this.dbConnection = dbConnection('pages', model)
  }

  delete(pageId) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {

        connection.destroy({
          where: {
            id: pageId
          }
        })
        .then((newPage)=>{
          connection.sequelize.close()
          resolve(newPage)
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao apagar a página ${pageId}`,
            data: err
          })
        })
      })
    }) 
  }

  deleteFromComic(comicId) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {

        connection.destroy({
          where: {
            comicId
          }
        })
        .then(()=>{
          connection.sequelize.close()
          resolve()
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao apagar a página da obra ${comicId}`,
            data: err
          })
        })
      })
    }) 
  }

}

export default service