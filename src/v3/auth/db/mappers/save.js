import model from '../model'
import dbConnection from '../../../database/helper'
import types from '../types'

const service = class {

  constructor () {
    this.usersConnection = dbConnection('users', model)
  }

  saveNew(userData) {

    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.create({
          name: userData.name,
          email: userData.email,
          pwd: userData.pwd,
          userType: userData.userType || types.COMMON,
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao salvar o usuário.`,
            data: err
          })
        })
      })
    })
    
  }

  promoteToAdmin(userId) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          userType: types.ADMIN,
        }, {
          returning: true, 
          where: {
            id: userId
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao promover o usuário para admin.`,
            data: err
          })
        })
      })
    })
  }


  promoteToCreator(userId) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          userType: types.CREATOR,
        }, {
          returning: true, 
          where: {
            id: userId
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao promover o usuário para criador.`,
            data: err
          })
        })
      })
    })
  }

  depromoteFromCreator(userId) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          userType: types.COMMON,
        }, {
          returning: true, 
          where: {
            id: userId
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao despromover o usuário de criador.`,
            data: err
          })
        })
      })
    })
  }


  depromoteFromAdmin(userId) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          userType: types.COMMON,
        }, {
          returning: true, 
          where: {
            id: userId
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao despromiver o usuário.`,
            data: err
          })
        })
      })
    })
  }

  update(user) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          name: user.name,
          email: user.email,
        }, {
          returning: true, 
          where: {
            id: user.id
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao atualizar os dados do usuário.`,
            data: err
          })
        })
      })
    })
  }

  updatePwd(user) {
    return new Promise((resolve, reject)=> {
      let usersConnection = this.usersConnection
      
      usersConnection.sync().then( () => {

        usersConnection.update({
          pwd: user.pwd,
        }, {
          returning: true, 
          where: {
            id: user.id
          }
        })
        .then((newUser)=>{
          usersConnection.sequelize.close()
          resolve(newUser)
        })
        .catch((err)=>{
          usersConnection.sequelize.close()
          reject({
            message: `Erro ao atualizar a senha do usuário.`,
            data: err
          })
        })
      })
    })
  }
}

export default service