import Sequelize from 'sequelize'

const entity = {
  comicId:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pageContent:{
    type: Sequelize.BLOB('medium'),
    allowNull: false
  },
  pagePosition:{
    type: Sequelize.INTEGER,
    allowNull: true
  },
  pageURL:{
    type: Sequelize.STRING,
    allowNull: true
  },
}

export default entity