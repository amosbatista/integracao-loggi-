import httpReq from 'superagent';

const validate = (login, password) => {
  return login != '' && password != ''
}

const service = (login, password) => {

  return new Promise( (resolve, reject) => {

    if(!validate(login, password)){
      res.status(STATUS_UNAUTHORIZED).send('Wrong password or login')
    }
    else {
      httpReq.post(process.env.LOGGI_API_V2)
        .query({query:'mutation { login(input:{email: \"' + login + '\", password: \"' + password + '\" }) { user { apiKey } } }'})
        .end((err, response) => {

          if(err){
            reject({
              message: 'Error in client API request'
            })
          }
          
          const resData = JSON.parse(response.text)

          try {
            const apiId = resData.data.login.user.apiKey
            resolve({
              apiId: apiId
            })
          }
          catch(err) {
            reject({
              message: 'It was impossible to generate user key. Check your password or login'
            })
          }
          
        })
    }
  })
}

export default service