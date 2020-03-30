import Sequelize from 'sequelize'

const service = (tableName, model) => {

  const maxConnections = 10
  const minConnections = 1
  const idleSecondsBeforeClose = 1000
  
  const sequelize = new Sequelize(process.env.LOG_DATABASE, process.env.LOG_LOGIN, process.env.LOG_PASSWORD, {
    host: process.env.LOG_HOST,
    //port: 41890,
    dialect: process.env.LOG_DATABASE_TYPE,
    pool: {
      max: maxConnections,
      min: minConnections,
      idle: idleSecondsBeforeClose
    }
  })
  
  return sequelize.define(tableName, model)
  
}

export default service