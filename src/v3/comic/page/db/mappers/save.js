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

  movePosition(pageFrom, pageTo) {

    return new Promise((resolve, reject)=> {
      let connection = this.dbConnection
      
      connection.sync().then( () => {

        const pageFromUpdate = connection.update({
            pagePosition: pageFrom.pagePosition
          } , {
          returning: true, 
          where: {
            id: pageFrom.id
          }
        })

        const pageToUpdate = connection.update({
          pagePosition: pageTo.pagePosition
        } , {
        returning: true, 
        where: {
          id: pageTo.id
        }
      })

      Promise.all([
        pageFromUpdate,
        pageToUpdate
      ]).then((newComic)=>{
        connection.sequelize.close()
        resolve(newComic)
      }).catch((err)=>{
        connection.sequelize.close()
        reject({
          message: `Erro ao atualizar posição das páginas ${pageFrom.id} para ${pageTo.id} `,
          data: err
        })
      })
      })
    }) 
  }

}

export default service