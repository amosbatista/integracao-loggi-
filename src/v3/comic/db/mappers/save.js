import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.dbConnection = dbConnection('comics', model)
  }

  saveNew(comicData) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {

        connection.create(comicData)
        .then((newComic)=>{
          connection.sequelize.close()
          resolve(newComic)
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao salvar uma obra.`,
            data: err
          })
        })
      })
    })
    
  }

  update(comic) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {
        connection.update(
          comic.frontPage ? comic : {
            creatorId: comic.creatorId,
            name: creator.name,
            description: comic.description,
            enabled: comic.enabled
          } , {
          returning: true, 
          where: {
            id: comic.id
          }
        }).then((newComic)=>{
          connection.sequelize.close()
          resolve(newComic)
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao atualizar uma obra.`,
            data: err
          })
        })
      })
    })
    
  }

}

export default service