import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    this.dbConnection = dbConnection('comics', model)
  }

  saveNew(comicData) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync({ alter: process.env.MUST_UPDATE_DATABASE_MODEL }).then( () => {

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
            name: comic.name,
            description: comic.description,
            enabled: comic.enabled,
            url: comic.url,
            fileName: comic.fileName
          } , {
          returning: true, 
          where: {
            id: comic.id
          }
        }).then((updatedComic)=>{
          connection.sequelize.close()
          resolve(updatedComic[1][0])
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao atualizar a obra ${comic.id}`,
            data: err
          })
        })
      })
    })
    
  }

  setStatus(comic, status) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {
        connection.update(
          {
            enabled: status
          } , {
          returning: true, 
          where: {
            id: comic.id
          }
        }).then((updatedComic)=>{
          connection.sequelize.close()
          resolve(updatedComic[0])
        })
        .catch((err)=>{
          connection.sequelize.close()
          reject({
            message: `Erro ao ${status ? 'habilidar' : 'desabilitar'} a obra ${comic.id}`,
            data: err
          })
        })
      })
    })
    
  }

}

export default service