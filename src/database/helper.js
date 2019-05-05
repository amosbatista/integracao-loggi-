import Sequelize from 'sequelize'

const service = (model, tableName) => {

  const maxConnections = 5
  const minConnections = 1
  const idleSecondsBeforeClose = 10000
  
  this.sequelize = new Sequelize(process.env.LOG_DATABASE, process.env.LOG_LOGIN, process.env.LOG_PASSWORD, {
    host: process.env.LOG_HOST,
    dialect: process.env.LOG_DATABASE_TYPE,
  
    pool: {
      max: maxConnections,
      min: minConnections,
      idle: idleSecondsBeforeClose
    }
  })

  return this.sequelize.define(tableName, model)
  
}

export default service