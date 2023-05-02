import Sequelize from 'sequelize'

const service = (tableName, model) => {

  const maxConnections = 10
  const minConnections = 1
  const idleSecondsBeforeClose = 10000
  
  const sequelize = new Sequelize(process.env.THOT_CONNECTION, {    
    log: false,
    dialect: process.env.THOT_DATABASE_TYPE,
    pool: {
      max: maxConnections,
      min: minConnections,
      idle: idleSecondsBeforeClose
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      }
    }
  })
  
  return sequelize.define(tableName, model)
  
}

export default service