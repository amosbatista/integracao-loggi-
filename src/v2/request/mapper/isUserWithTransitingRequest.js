import model from '../model'
import dbConnection from '../../database/helper'
import types from '../status'
import { Op } from 'sequelize'

const service = class {

  constructor () {
    this.requestModel = dbConnection('request', model)
  }

  check(userId) {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.findOne({
          where: { 
            userId,
            status: {
              [Op.in]: [
                types.AT_RECEIVE,
                types.READY_TO_RETURN,
              ]
            }
          }
        })
        .then((request)=>{
          resolve(request ? true : false)
        })
        .catch((err)=>{
          requestModel.sequelize.close()
          reject({
            message: `Erro ao pesquisar se usuário já tem pedido em trânsito.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service