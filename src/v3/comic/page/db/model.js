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
    allowNull: false
  },
}

export default entity