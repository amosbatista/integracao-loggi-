import model from '../model'
import dbConnection from '../../../../database/helper'

const service = class {

  constructor () {
    this.model = dbConnection('pages', model)
  }

  load(pageId) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findOne({
          where: { 
            id: pageId
          }
        })
        .then((page)=>{
          model.sequelize.close()
          resolve(page)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar a página ${pageId}.`,
            data: err
          })
        })
      })
    })
  }

  loadAllFromComic(comicId) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {
        model.findAll({
          where: { 
            comicId
          },
          order: [
            ['pagePosition', 'ASC'],
          ]
        }).catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar a obra do criador ${comicId}.`,
            data: err
          })
        })
        .then((comics)=>{
          model.sequelize.close()
          resolve(comics)
        })
        
      })
    })
  }
}

export default service