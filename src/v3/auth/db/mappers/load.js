import model from '../model'
import dbConnection from '../../../database/helper'
const { Op } = require("sequelize");

const service = class {

  constructor () {
    this.model = dbConnection('users', model)
  }

  load(id) {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findOne({
          attributes: ['id', 'name', 'email', 'userType', 'createdAt', 'updatedAt'],
          where: { 
            id,
            [Op.not]: [
              { disabled: true } 
            ]            
          }
        })
        .then((user)=>{
          model.sequelize.close()
          resolve(user ? user.dataValues : null)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar os dados do usuário ${id}.`,
            data: err
          })
        })
      })
    })
  }

  loadAll() {

    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findAll({
          attributes: ['id', 'name', 'email', 'disabled', 'userType', 'createdAt', 'updatedAt'],
        })
        .then((users)=>{
          model.sequelize.close()
          resolve(users)
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar lista de usuários.`,
            data: err
          })
        })
      })
    })
  }
}

export default service