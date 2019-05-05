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

        requestModel.loadAll({
          attributes: { 
            exclude: ['createdAt', 'updatedAt'] 
          }
        })
        .then((requests)=>{
          console.log('Request list:', requests)
          resolve(requests)
        })
        .catch((err)=>{
          reject({
            message: 'Error at retrieve of all requests from database.',
            data: err
          })
        })
      })
    })
    
  }
}

export default service