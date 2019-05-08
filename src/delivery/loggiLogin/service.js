import httpReq from 'superagent';
import Model from './model' 

const validate = (login, password) => {
  return login != '' && password != ''
}

const service = () => {

  return new Promise( (resolve, reject) => {

    const login = process.env.LOGGI_USER_LOGIN
    const password = process.env.LOGGI_USER_PASSWORD

    if(!validate(login, password)){
      reject({
        message: 'O login ou a senha está vazio.'
      })
    }
    else {
      httpReq.post(process.env.LOGGI_API_V2)
      .query({query:'mutation { login(input:{email: \"' + login + '\", password: \"' + password + '\" }) { user { apiKey } } }'})
      .end((err, response) => {

        if(err){
          reject({
            message: 'Erro na requsição de login na API da Loggi',
            data: err
          })

          return
        }
        
        const resData = JSON.parse(response.text)

        try {
          const apiId = resData.data.login.user.apiKey
          const authData = new Model(login, password, apiId)

          resolve(authData)
        }
        catch(err) {

          reject({
            message: 'Foi impossível conseguir a autenticação. Favor verificar o login e senha.',
            data: err
          })
        }
      })
    }
  })
}

export default service