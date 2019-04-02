import httpReq from 'superagent';
import Model from './model' 

const validate = (login, password) => {
  return login != '' && password != ''
}

const service = () => {

  return new Promise( (resolve, reject) => {

    const login = process.env.userLogin
    const password = process.env.userPassword

    if(!validate(login, password)){
      reject({
        message: 'Login or password is empty'
      })
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
          const authData = new Model(login, password, apiId)
          resolve(authData)
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