

const service = class {

  save(requestData) {
    return new Promise((resolve, reject)=> {
      reject({
        message: 'deve retornar erro',
        data: null
      })
    })
    
  }
}

export default service