import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestModel = dbConnection('request', model)
  }

  loadAll() {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.findAll()
        .then((requests)=>{
          resolve(requests)
        })
        .catch((err)=>{
          reject({
            message: 'Erro ao pesquisar todos os pedidos do banco de dados.',
            data: err
          })
        })
      })
    })
    
  }
}

export default service