import model from '../model'
import dbConnection from '../../../database/helper'

const service = class {

  constructor () {
    
  }

  connect() {
    this.model = dbConnection('users', model)
  }

  setTokenToUser(email, token, recoveryKey) {
    this.connect();
    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.update(
          {
            pwdRecoverToken: token,
            pwdRecoverKey: recoveryKey
          },
          {
            returning: false, 
            where: {
              email
            }
          }
        )
        .then(()=>{
          model.sequelize.close()
          resolve()
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao configurar token de recuperação de senha.`,
            data: err
          })
        })
      })
    })
    
  }

  loadByRecoverKey(recoveryKey) {
    this.connect()
    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.findOne({
          attributes: ['pwdRecoverToken'],
          where: { 
            pwdRecoverKey: recoveryKey
          }
        })
        .then((user)=>{
          model.sequelize.close()
          
          if(!user) {
            reject({
              message: `Não será possível alterar a senha.`,
              data: null
            })
          }
          else {
            resolve(user.pwdRecoverToken)
          }
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao carregar token de recuperação de senha.`,
            data: err
          })
        })
      })
    })
    
  }

  setNewPwd(email, pwd) {
    this.connect()
    return new Promise((resolve, reject)=> {
      let model = this.model
      
      model.sync().then( () => {

        model.update(
          {
            pwd,
            pwdRecoverToken: null,
            pwdRecoverKey: null
          },
          {
            returning: false, 
            where: {
              email
            }
          }
        )
        .then(()=>{
          model.sequelize.close()
          resolve()
        })
        .catch((err)=>{
          model.sequelize.close()
          reject({
            message: `Erro ao configurar nova senha.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service