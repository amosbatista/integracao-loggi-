import Sequelize from 'sequelize'

const service = (tableName, model) => {

  const maxConnections = 2
  const minConnections = 0
  const idleSecondsBeforeClose = 1
  
  const sequelize = new Sequelize(process.env.LOG_DATABASE, process.env.LOG_LOGIN, process.env.LOG_PASSWORD, {
    host: process.env.LOG_HOST,
    dialect: process.env.LOG_DATABASE_TYPE,
    logging: false,
    pool: {
      max: maxConnections,
      min: minConnections,
      idle: idleSecondsBeforeClose,
      acquire: 10
    }
  })
  
  return sequelize.define(tableName, model)
  
}

export default service