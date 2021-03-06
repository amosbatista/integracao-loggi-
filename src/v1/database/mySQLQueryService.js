import mysql from 'mysql2'

export default (query) => {

  return new Promise ( (resolve, reject) => {
    const miliseconds = 1000;
    const connConfig = {
      "host": process.env.LOG_HOST,
      "database": process.env.LOG_DATABASE,
      "user": process.env.LOG_LOGIN,
      "password": process.env.LOG_PASSWORD,
      "connectTimeout": miliseconds * process.env.LOG_PASSWORD,
      "port": process.env.LOG_PORT,
    }
    const connection = mysql.createConnection(connConfig);
    const queryParameters = []

    connection.connect();
    connection.query(query, queryParameters , (error, results) => {

      connection.end();

      if (error){
        reject(error);
        return
      }	

      if(results.length <= 0){
        resolve([]);
        return
      }

      resolve(results)
      
    })
  })
}