import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestModel = dbConnection('request', model)
  }

  update(request, newStatus) {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.update(
          {
            status: newStatus
          },
          {
            returning: true, 
            where: {
              id: request.id
            }
          }
        )
        .then((updatedRequests)=>{
          resolve(updatedRequests)
        })
        .catch((err)=>{
          reject({
            message: 'Error at update new request into database',
            data: err
          })
        })
      })
    })
    
  }
}

export default service